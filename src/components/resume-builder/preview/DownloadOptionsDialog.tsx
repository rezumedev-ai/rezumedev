import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileDown, Lock } from "lucide-react";
import { useState } from "react";
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
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleDownloadPDF = async () => {
    setOpen(false);
    
    // If no subscription, show subscription dialog
    if (!hasActiveSubscription) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    try {
      // Updated selector to match the resume content div
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        console.error("Could not find element with id 'resume-content'");
        toast.error("Could not find resume content. Please try again later.");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Wait for dialog to close and any transitions to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get device pixel ratio for better quality
      const pixelRatio = window.devicePixelRatio || 1;
      
      // A4 dimensions in pixels (at 96 DPI)
      const a4Width = 8.27 * 96; // 793.92 pixels
      const a4Height = 11.69 * 96; // 1122.24 pixels

      // Calculate scale to fit the resume content to A4 size while preserving aspect ratio
      const contentWidth = resumeElement.offsetWidth;
      const contentHeight = resumeElement.offsetHeight;
      const scale = Math.min(a4Width / contentWidth, a4Height / contentHeight);
      
      // Store original styles
      const originalStyles = {
        transform: resumeElement.style.transform,
        transition: resumeElement.style.transition,
        width: resumeElement.style.width,
        height: resumeElement.style.height,
        position: resumeElement.style.position,
        pointerEvents: resumeElement.style.pointerEvents,
        transformOrigin: resumeElement.style.transformOrigin,
        visibility: resumeElement.style.visibility
      };
      
      // Enhanced CSS fixes for PDF generation
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* General fixes for all elements */
        .pdf-specific-fixes * {
          box-shadow: none !important;
          text-shadow: none !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid !important;
        }
        
        /* Profile image fixes */
        .pdf-specific-fixes .rounded-full {
          border-radius: 50% !important;
          overflow: hidden !important;
        }
        
        .pdf-specific-fixes .rounded-full img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 50% !important;
          aspect-ratio: 1/1 !important;
        }
        
        /* Improved contact item alignment with data attributes */
        .pdf-specific-fixes [data-pdf-contact-item] {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 4px !important;
          margin-bottom: 2px !important;
          height: 24px !important;
          line-height: 24px !important;
        }
        
        .pdf-specific-fixes [data-pdf-contact-icon] {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          vertical-align: middle !important;
          width: 16px !important;
          height: 16px !important;
          margin: 0 !important;
          padding: 0 !important;
          position: relative !important;
          top: 0 !important;
        }
        
        .pdf-specific-fixes [data-pdf-contact-text] {
          display: inline-block !important;
          vertical-align: middle !important;
          line-height: 24px !important;
          height: 24px !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Improved bullet point alignment with data attributes */
        .pdf-specific-fixes [data-pdf-bullet-item] {
          display: flex !important;
          align-items: flex-start !important;
          margin-bottom: 4px !important;
          page-break-inside: avoid !important;
          line-height: 1.4 !important;
        }
        
        .pdf-specific-fixes [data-pdf-bullet-container] {
          display: flex !important;
          align-items: flex-start !important;
          width: 100% !important;
          position: relative !important;
        }
        
        .pdf-specific-fixes [data-pdf-bullet] {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          width: 6px !important;
          height: 6px !important;
          min-width: 6px !important;
          min-height: 6px !important;
          margin-right: 8px !important;
          margin-top: 7px !important;
          background-color: #000000 !important;
          border-radius: 50% !important;
          position: relative !important;
          top: 0 !important;
        }
        
        .pdf-specific-fixes [data-pdf-bullet-text] {
          display: inline-block !important;
          vertical-align: top !important;
          flex-grow: 1 !important;
          line-height: 1.4 !important;
          margin-top: 0 !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Temporarily disable scale transform for capture
      const originalTransform = resumeElement.style.transform;
      resumeElement.style.transform = 'none';
      
      // Force the element to be visible and properly sized for capture
      Object.assign(resumeElement.style, {
        transition: 'none',
        position: resumeElement.style.position || 'relative',
        pointerEvents: 'none',
        transformOrigin: 'top left',
        visibility: 'visible'
      });

      // Force layout recalculation
      resumeElement.getBoundingClientRect();
      
      // Temporarily disable any transitions or animations
      const allElements = resumeElement.querySelectorAll('*');
      const originalTransitions: string[] = [];
      
      allElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        originalTransitions.push(htmlEl.style.transition);
        htmlEl.style.transition = 'none';
      });

      console.log("Attempting to capture resume content with dimensions:", {
        width: contentWidth,
        height: contentHeight,
        element: resumeElement
      });

      // Capture with improved settings
      const canvas = await html2canvas(resumeElement, {
        scale: pixelRatio * 2.5, // Increased scale for sharper images and better alignment
        useCORS: true,
        allowTaint: true,
        logging: false, // Disable logging for production
        backgroundColor: "#ffffff",
        imageTimeout: 15000, // Increase timeout for complex resumes
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDocument, element) => {
          const clonedElement = element as HTMLElement;
          
          // Add the PDF-specific class to the cloned element
          clonedElement.classList.add('pdf-specific-fixes');
          
          // Apply exact styling to the cloned element
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'top left';
          clonedElement.style.width = `${contentWidth}px`;
          clonedElement.style.height = `${contentHeight}px`;
          
          // Enhanced styling for contact items using data attributes
          const contactItems = clonedElement.querySelectorAll('[data-pdf-contact-item]');
          contactItems.forEach(item => {
            const contactItem = item as HTMLElement;
            contactItem.style.display = 'flex';
            contactItem.style.alignItems = 'center';
            contactItem.style.justifyContent = 'flex-start';
            contactItem.style.gap = '4px';
            contactItem.style.marginBottom = '2px';
            contactItem.style.height = '24px';
            contactItem.style.lineHeight = '24px';
            
            // Style the icon
            const icon = contactItem.querySelector('[data-pdf-contact-icon]');
            if (icon) {
              const iconEl = icon as HTMLElement;
              iconEl.style.display = 'inline-flex';
              iconEl.style.alignItems = 'center';
              iconEl.style.justifyContent = 'center';
              iconEl.style.flexShrink = '0';
              iconEl.style.width = '16px';
              iconEl.style.height = '16px';
              iconEl.style.margin = '0';
              iconEl.style.padding = '0';
              iconEl.style.position = 'relative';
              iconEl.style.top = '0';
              iconEl.style.verticalAlign = 'middle';
            }
            
            // Style the text
            const text = contactItem.querySelector('[data-pdf-contact-text]');
            if (text) {
              const textEl = text as HTMLElement;
              textEl.style.display = 'inline-block';
              textEl.style.verticalAlign = 'middle';
              textEl.style.lineHeight = '24px';
              textEl.style.height = '24px';
              textEl.style.margin = '0';
              textEl.style.padding = '0';
            }
          });
          
          // Enhanced styling for bullet points using data attributes
          const bulletItems = clonedElement.querySelectorAll('[data-pdf-bullet-item]');
          bulletItems.forEach(item => {
            const bulletItem = item as HTMLElement;
            bulletItem.style.display = 'flex';
            bulletItem.style.alignItems = 'flex-start';
            bulletItem.style.marginBottom = '4px';
            bulletItem.style.pageBreakInside = 'avoid';
            bulletItem.style.lineHeight = '1.4';
            
            // Style the bullet container
            const bulletContainer = bulletItem.querySelector('[data-pdf-bullet-container]');
            if (bulletContainer) {
              const container = bulletContainer as HTMLElement;
              container.style.display = 'flex';
              container.style.alignItems = 'flex-start';
              container.style.width = '100%';
              container.style.position = 'relative';
              
              // Style the bullet point
              const bullet = container.querySelector('[data-pdf-bullet]');
              if (bullet) {
                const bulletEl = bullet as HTMLElement;
                bulletEl.style.display = 'inline-flex';
                bulletEl.style.alignItems = 'center';
                bulletEl.style.justifyContent = 'center';
                bulletEl.style.flexShrink = '0';
                bulletEl.style.width = '6px';
                bulletEl.style.height = '6px';
                bulletEl.style.minWidth = '6px';
                bulletEl.style.minHeight = '6px';
                bulletEl.style.marginRight = '8px';
                bulletEl.style.marginTop = '7px';
                bulletEl.style.backgroundColor = '#000000';
                bulletEl.style.borderRadius = '50%';
                bulletEl.style.position = 'relative';
                bulletEl.style.top = '0';
              }
              
              // Style the text
              const text = container.querySelector('[data-pdf-bullet-text]');
              if (text) {
                const textEl = text as HTMLElement;
                textEl.style.display = 'inline-block';
                textEl.style.verticalAlign = 'top';
                textEl.style.flexGrow = '1';
                textEl.style.lineHeight = '1.4';
                textEl.style.marginTop = '0';
              }
            }
          });
          
          // Ensure fonts are properly loaded in the clone
          const fontLinks = Array.from(clonedDocument.querySelectorAll('link[rel="stylesheet"]'));
          const head = clonedDocument.head;
          
          fontLinks.forEach(link => {
            const linkEl = link as HTMLLinkElement;
            if (linkEl.href.includes('fonts.googleapis.com') || linkEl.href.includes('fonts')) {
              const newLink = clonedDocument.createElement('link');
              newLink.rel = 'stylesheet';
              newLink.href = linkEl.href;
              head.appendChild(newLink);
            }
          });
          
          // Make sure all fonts have loaded in the clone
          return new Promise<void>(resolve => {
            if ((document as any).fonts && (document as any).fonts.ready) {
              (document as any).fonts.ready.then(() => {
                setTimeout(resolve, 800); // Increased delay to ensure rendering
              });
            } else {
              // Fallback if document.fonts is not available
              setTimeout(resolve, 1000);
            }
          });
        }
      });

      // Remove the temporary style element
      document.head.removeChild(styleElement);

      // Restore original transitions
      allElements.forEach((el: Element, index: number) => {
        (el as HTMLElement).style.transition = originalTransitions[index];
      });

      // Restore original transform and other styles
      resumeElement.style.transform = originalTransform;
      Object.assign(resumeElement.style, originalStyles);

      // Force browser to repaint
      resumeElement.getBoundingClientRect();

      // Create PDF with the exact A4 dimensions
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true,
        precision: 16 // Higher precision for better positioning
      });

      // Convert canvas to image
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
        'FAST'
      );

      // Save PDF directly
      pdf.save('resume.pdf');
      
      // Clear loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
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
          disabled={isDownloading}
          className="flex items-center gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        >
          <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{isDownloading ? "Preparing..." : "Download"}</span>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Button 
              className="w-full" 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              Download as PDF
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
