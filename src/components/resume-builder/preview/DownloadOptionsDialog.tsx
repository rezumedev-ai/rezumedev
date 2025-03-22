
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
      
      // A4 dimensions in pixels (at 300 DPI for high-quality print)
      const a4Width = 8.27 * 300; // 2481 pixels
      const a4Height = 11.69 * 300; // 3507 pixels

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
      
      // Create a deep clone of the resume element to avoid modifying the original
      const clonedResume = resumeElement.cloneNode(true) as HTMLElement;
      
      // Fix for profile image and bullet points: add specific CSS class to the cloned content
      clonedResume.classList.add('pdf-specific-fixes');
      
      // Set styles for exact capture
      clonedResume.style.position = 'absolute';
      clonedResume.style.top = '-9999px';
      clonedResume.style.left = '-9999px';
      clonedResume.style.transform = 'none';
      clonedResume.style.width = `${resumeElement.offsetWidth}px`;
      clonedResume.style.height = `${resumeElement.offsetHeight}px`;
      clonedResume.style.margin = '0';
      clonedResume.style.padding = '0';
      clonedResume.style.visibility = 'hidden';
      
      // Fix all bullet points in the clone
      const bulletPoints = clonedResume.querySelectorAll('.bullet-point');
      bulletPoints.forEach((bullet) => {
        const bulletElement = bullet as HTMLElement;
        bulletElement.style.display = 'inline-flex';
        bulletElement.style.alignItems = 'center';
        bulletElement.style.justifyContent = 'center';
        bulletElement.style.width = '6px';
        bulletElement.style.height = '6px';
        bulletElement.style.minWidth = '6px';
        bulletElement.style.minHeight = '6px';
        bulletElement.style.borderRadius = '50%';
        bulletElement.style.marginRight = '8px';
        bulletElement.style.marginTop = '6px';
        bulletElement.style.flexShrink = '0';
        bulletElement.style.backgroundColor = '#000';
      });
      
      // Fix all responsibility items
      const responsibilityItems = clonedResume.querySelectorAll('.responsibility-list li');
      responsibilityItems.forEach((item) => {
        const itemElement = item as HTMLElement;
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'flex-start';
        itemElement.style.marginBottom = '4px';
        
        const responsibilityText = itemElement.querySelector('.responsibility-text');
        if (responsibilityText) {
          (responsibilityText as HTMLElement).style.display = 'inline-block';
          (responsibilityText as HTMLElement).style.flex = '1';
          (responsibilityText as HTMLElement).style.lineHeight = '1.4';
        }
      });
      
      // Fix rounded profile images
      const roundedImages = clonedResume.querySelectorAll('.rounded-full');
      roundedImages.forEach((img) => {
        const imgElement = img as HTMLElement;
        imgElement.style.borderRadius = '50%';
        imgElement.style.overflow = 'hidden';
        
        const imageTag = imgElement.querySelector('img');
        if (imageTag) {
          imageTag.style.width = '100%';
          imageTag.style.height = '100%';
          imageTag.style.objectFit = 'cover';
        }
      });
      
      // Apply specific style to ensure exact rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-specific-fixes * {
          box-shadow: none !important;
          text-shadow: none !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        .pdf-specific-fixes .bullet-point {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 6px !important;
          height: 6px !important;
          min-width: 6px !important;
          min-height: 6px !important;
          border-radius: 50% !important;
          margin-right: 8px !important;
          margin-top: 6px !important;
          flex-shrink: 0 !important;
          background-color: #000 !important;
        }
        .pdf-specific-fixes .responsibility-list li {
          display: flex !important;
          align-items: flex-start !important;
          margin-bottom: 4px !important;
          page-break-inside: avoid !important;
        }
        .pdf-specific-fixes .responsibility-text {
          display: inline-block !important;
          flex: 1 !important;
          line-height: 1.4 !important;
        }
        .pdf-specific-fixes .rounded-full {
          border-radius: 50% !important;
          overflow: hidden !important;
        }
        .pdf-specific-fixes .rounded-full img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `;
      
      // Append the clone and styles to the document
      document.body.appendChild(styleElement);
      document.body.appendChild(clonedResume);
      
      // Wait a moment for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("Attempting to capture cloned resume content with dimensions:", {
        width: clonedResume.offsetWidth,
        height: clonedResume.offsetHeight,
        element: clonedResume
      });

      // Capture with improved settings
      const canvas = await html2canvas(clonedResume, {
        scale: pixelRatio * 3, // Triple the scale for ultra-sharp images
        useCORS: true,
        allowTaint: true,
        logging: true, // Enable logging for debugging
        backgroundColor: "#ffffff",
        imageTimeout: 30000, // Increase timeout for complex resumes
        foreignObjectRendering: false, // Sometimes disabling can yield better results
        letterRendering: true, // Improves text rendering
        onclone: (clonedDoc) => {
          // Make sure all fonts have loaded in the clone
          return new Promise<void>(resolve => {
            if ((document as any).fonts && (document as any).fonts.ready) {
              (document as any).fonts.ready.then(() => {
                setTimeout(resolve, 500); // Increased delay to ensure rendering
              });
            } else {
              // Fallback if document.fonts is not available
              setTimeout(resolve, 600);
            }
          });
        }
      });

      // Remove the temporary elements
      document.body.removeChild(styleElement);
      document.body.removeChild(clonedResume);

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

      // Convert canvas to image with high quality
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
