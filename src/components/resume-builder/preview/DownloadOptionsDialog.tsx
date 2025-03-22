
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileDown, Lock, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DownloadOptionsDialogProps {
  isDownloading: boolean;
}

export function DownloadOptionsDialog({
  isDownloading
}: DownloadOptionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toastIdRef = useRef<string | number | undefined>();

  // Fetch user profile to check subscription status
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_plan, subscription_status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user
  });

  const hasActiveSubscription = profile && 
    profile.subscription_plan && 
    (profile.subscription_status === 'active' || profile.subscription_status === 'canceled');

  const prepareResumeForCapture = (resumeElement: HTMLElement) => {
    // Inject PDF-specific CSS class for better styling during capture
    resumeElement.classList.add('pdf-generation-mode');
    
    // Store original styles
    const originalStyles = {
      transform: resumeElement.style.transform,
      transition: resumeElement.style.transition,
      width: resumeElement.style.width,
      height: resumeElement.style.height,
      position: resumeElement.style.position,
      zoom: resumeElement.style.zoom,
      transformOrigin: resumeElement.style.transformOrigin,
      visibility: resumeElement.style.visibility
    };
    
    // Temporarily disable transforms for capture
    resumeElement.style.transform = 'none';
    resumeElement.style.transition = 'none';
    resumeElement.style.zoom = '1';
    resumeElement.style.position = resumeElement.style.position || 'relative';
    resumeElement.style.transformOrigin = 'top left';
    resumeElement.style.visibility = 'visible';
    
    // Force layout recalculation
    resumeElement.getBoundingClientRect();
    
    // Temporarily disable any transitions or animations on all elements
    const allElements = resumeElement.querySelectorAll('*');
    const originalTransitions: string[] = [];
    
    allElements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      originalTransitions.push(htmlEl.style.transition);
      htmlEl.style.transition = 'none';
    });
    
    // Enhance bullet point containers and icons
    const bulletPointContainers = resumeElement.querySelectorAll('.bullet-point-container');
    bulletPointContainers.forEach((container) => {
      (container as HTMLElement).style.display = 'flex';
      (container as HTMLElement).style.alignItems = 'flex-start';
      (container as HTMLElement).style.pageBreakInside = 'avoid';
      (container as HTMLElement).style.breakInside = 'avoid';
      (container as HTMLElement).style.marginBottom = '0.25rem';
    });
    
    const bulletPointIcons = resumeElement.querySelectorAll('.bullet-point-icon');
    bulletPointIcons.forEach((icon) => {
      (icon as HTMLElement).style.display = 'inline-flex';
      (icon as HTMLElement).style.alignItems = 'center';
      (icon as HTMLElement).style.justifyContent = 'center';
      (icon as HTMLElement).style.flexShrink = '0';
      (icon as HTMLElement).style.marginRight = '0.5rem';
      (icon as HTMLElement).style.position = 'relative';
      (icon as HTMLElement).style.top = '0.25rem';
    });
    
    const bulletPointTexts = resumeElement.querySelectorAll('.bullet-point-text');
    bulletPointTexts.forEach((text) => {
      (text as HTMLElement).style.flex = '1 1 auto';
      (text as HTMLElement).style.lineHeight = '1.5';
    });
    
    // Special handling for section icons
    const sectionIcons = resumeElement.querySelectorAll('.section-icon-container');
    sectionIcons.forEach((icon) => {
      (icon as HTMLElement).style.display = 'inline-flex';
      (icon as HTMLElement).style.alignItems = 'center';
      (icon as HTMLElement).style.justifyContent = 'center';
      (icon as HTMLElement).style.flexShrink = '0';
      (icon as HTMLElement).style.marginRight = '0.5rem';
    });
    
    // Special handling for template-specific bullet points
    const templateBullets = resumeElement.querySelectorAll(
      '.executive-clean-bullet, .modern-split-bullet, .minimal-elegant-bullet, ' + 
      '.professional-executive-bullet, .modern-professional-bullet, .professional-navy-bullet'
    );
    
    templateBullets.forEach((bullet) => {
      (bullet as HTMLElement).style.display = 'inline-flex';
      (bullet as HTMLElement).style.alignItems = 'center';
      (bullet as HTMLElement).style.justifyContent = 'center';
    });
    
    // Special handling for profile images
    const profileImages = resumeElement.querySelectorAll('.rounded-full');
    profileImages.forEach(img => {
      (img as HTMLElement).style.overflow = 'hidden';
      (img as HTMLElement).style.borderRadius = '50%';
      const imageElement = img.querySelector('img');
      if (imageElement) {
        imageElement.style.objectFit = 'cover';
        imageElement.style.width = '100%';
        imageElement.style.height = '100%';
      }
    });
    
    return {
      originalStyles,
      originalTransitions,
      allElements
    };
  };
  
  const restoreResumeStyles = (
    resumeElement: HTMLElement, 
    originalStyles: Record<string, string>,
    allElements: NodeListOf<Element>,
    originalTransitions: string[]
  ) => {
    // Remove the PDF-specific class
    resumeElement.classList.remove('pdf-generation-mode');
    
    // Restore original styles
    Object.assign(resumeElement.style, originalStyles);
    
    // Restore original transitions
    allElements.forEach((el: Element, index: number) => {
      (el as HTMLElement).style.transition = originalTransitions[index];
    });
    
    // Force browser to repaint
    resumeElement.getBoundingClientRect();
  };

  const handleDownloadPDF = async () => {
    setOpen(false);
    
    // If no subscription, show subscription dialog
    if (!hasActiveSubscription) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    try {
      // Set download in progress
      setDownloadInProgress(true);
      
      // Show loading toast
      toastIdRef.current = toast.loading("Preparing your pixel-perfect PDF...");
      
      // Get the resume element
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        console.error("Could not find element with id 'resume-content'");
        toast.error("Could not find resume content. Please try again later.");
        setDownloadInProgress(false);
        return;
      }

      // Wait for any dialog to close and transitions to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get device pixel ratio for better quality
      const pixelRatio = window.devicePixelRatio || 1;
      const contentWidth = resumeElement.offsetWidth;
      const contentHeight = resumeElement.offsetHeight;

      // Prepare the resume element for capture and store original styles
      const { originalStyles, originalTransitions, allElements } = prepareResumeForCapture(resumeElement);
      
      // Add a temporary style element for capture-specific fixes
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-generation-mode {
          transform: none !important;
          transition: none !important;
        }
        .pdf-generation-mode * {
          transition: none !important;
          animation: none !important;
        }
        .pdf-generation-mode .bullet-point-container {
          display: flex !important;
          align-items: flex-start !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0.25rem !important;
          position: relative !important;
        }
        .pdf-generation-mode .bullet-point-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          margin-right: 0.5rem !important;
          position: relative !important;
          top: 0.25rem !important;
        }
        .pdf-generation-mode .bullet-point-text {
          flex: 1 1 auto !important;
          display: inline-block !important;
          line-height: 1.5 !important;
        }
        .pdf-generation-mode .section-icon-container {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          margin-right: 0.5rem !important;
        }
        .pdf-generation-mode .rounded-full {
          overflow: hidden !important;
          border-radius: 50% !important;
        }
        .pdf-generation-mode .rounded-full img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `;
      document.head.appendChild(styleElement);

      // Capture with enhanced settings
      const canvas = await html2canvas(resumeElement, {
        scale: pixelRatio * 4, // Quadruple the scale for razor-sharp images
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 15000, // Increase timeout for complex resumes
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDocument, element) => {
          const clonedElement = element as HTMLElement;
          
          // Add PDF-specific class to the cloned element too
          clonedElement.classList.add('pdf-generation-mode');
          
          // Apply exact styling to the cloned element
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'top left';
          clonedElement.style.width = `${contentWidth}px`;
          clonedElement.style.height = `${contentHeight}px`;
          
          // Enhance all bullet points in the clone
          const bulletPointContainers = clonedElement.querySelectorAll('.bullet-point-container');
          bulletPointContainers.forEach((container) => {
            (container as HTMLElement).style.display = 'flex';
            (container as HTMLElement).style.alignItems = 'flex-start';
            (container as HTMLElement).style.pageBreakInside = 'avoid';
            (container as HTMLElement).style.breakInside = 'avoid';
            (container as HTMLElement).style.marginBottom = '0.25rem';
          });
          
          const bulletPointIcons = clonedElement.querySelectorAll('.bullet-point-icon');
          bulletPointIcons.forEach((icon) => {
            (icon as HTMLElement).style.display = 'inline-flex';
            (icon as HTMLElement).style.alignItems = 'center';
            (icon as HTMLElement).style.justifyContent = 'center';
            (icon as HTMLElement).style.flexShrink = '0';
            (icon as HTMLElement).style.marginRight = '0.5rem';
            (icon as HTMLElement).style.position = 'relative';
            (icon as HTMLElement).style.top = '0.25rem';
          });
          
          const bulletPointTexts = clonedElement.querySelectorAll('.bullet-point-text');
          bulletPointTexts.forEach((text) => {
            (text as HTMLElement).style.flex = '1 1 auto';
            (text as HTMLElement).style.lineHeight = '1.5';
          });
          
          // Wait for fonts to load in the clone
          return new Promise<void>(resolve => {
            if ((document as any).fonts && (document as any).fonts.ready) {
              (document as any).fonts.ready.then(() => {
                setTimeout(resolve, 600); // Increased delay to ensure rendering
              });
            } else {
              // Fallback if document.fonts is not available
              setTimeout(resolve, 700);
            }
          });
        }
      });

      // Remove temporary style element
      document.head.removeChild(styleElement);
      
      // Restore resume styles
      restoreResumeStyles(resumeElement, originalStyles, allElements, originalTransitions);

      // Create PDF with precise A4 dimensions
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true,
        precision: 16 // Higher precision for better positioning
      });

      // Convert canvas to image with highest quality
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate dimensions to maintain aspect ratio and fit A4
      const canvasAspectRatio = canvas.width / canvas.height;
      const a4AspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight, offsetX, offsetY;
      
      if (canvasAspectRatio > a4AspectRatio) {
        // Canvas is wider than A4
        imgWidth = pdfWidth;
        imgHeight = imgWidth / canvasAspectRatio;
        offsetX = 0;
        offsetY = (pdfHeight - imgHeight) / 2;
      } else {
        // Canvas is taller than A4 or same ratio
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
        offsetX = (pdfWidth - imgWidth) / 2;
        offsetY = 0;
      }
      
      // Add image with precise positioning
      pdf.addImage(
        imgData,
        'JPEG',
        offsetX,
        offsetY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST' // Faster compression
      );

      // Add metadata to the PDF
      pdf.setProperties({
        title: 'Professional Resume',
        subject: 'Resume',
        creator: 'Rezume.dev',
        keywords: 'resume, professional, career',
        author: user?.email || 'User'
      });

      // Save PDF directly
      pdf.save('professional-resume.pdf');
      
      // Clear loading toast and show success
      toast.dismiss(toastIdRef.current);
      toast.success("Pixel-perfect PDF generated successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss(toastIdRef.current);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadInProgress(false);
    }
  };

  const navigateToPricing = () => {
    setShowSubscriptionDialog(false);
    navigate("/pricing");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setOpen(true)}
          disabled={isDownloading || downloadInProgress}
          className="flex items-center gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        >
          {downloadInProgress ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isDownloading ? "Preparing..." : "Download"}</span>
            </>
          )}
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Resume</DialogTitle>
            <DialogDescription>
              Get a pixel-perfect PDF of your resume for printing or sharing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Button 
              className="w-full" 
              onClick={handleDownloadPDF}
              disabled={isDownloading || downloadInProgress}
            >
              {downloadInProgress ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                "Download as PDF"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Required Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Subscription Required
            </DialogTitle>
            <DialogDescription>
              Downloading resumes requires an active subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 mb-4">
              Upgrade to a paid plan to unlock resume downloads, unlimited resume creation, premium templates, and AI-powered resume optimization.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
              className="sm:w-auto w-full"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={navigateToPricing}
              className="sm:w-auto w-full bg-gradient-to-r from-primary to-primary-hover"
            >
              View Pricing Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
