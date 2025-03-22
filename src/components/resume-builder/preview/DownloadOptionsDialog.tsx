
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
      
      // Get the exact dimensions of the resume element
      const resumeBounds = resumeElement.getBoundingClientRect();
      const resumeWidth = resumeBounds.width;
      const resumeHeight = resumeBounds.height;
      
      console.log("Capturing resume with dimensions:", {
        width: resumeWidth,
        height: resumeHeight,
        pixelRatio: pixelRatio
      });

      // Clone the resume element for manipulation
      const clonedResume = resumeElement.cloneNode(true) as HTMLElement;
      
      // Create a style element to ensure proper rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .bullet-point, .responsibility-list li::before {
          display: inline-block !important;
          width: 6px !important;
          height: 6px !important;
          background-color: black !important;
          border-radius: 50% !important;
          margin-right: 8px !important;
          margin-top: 6px !important;
          flex-shrink: 0 !important;
        }
        .responsibility-list li {
          display: flex !important;
          align-items: flex-start !important;
          margin-bottom: 4px !important;
        }
        .responsibility-text {
          display: inline-block !important;
          flex: 1 !important;
        }
        .rounded-full {
          border-radius: 50% !important;
          overflow: hidden !important;
        }
      `;
      
      // Append the clone to a hidden container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = `${resumeWidth}px`;
      container.style.height = `${resumeHeight}px`;
      container.style.overflow = 'hidden';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      
      // Append elements to document
      container.appendChild(styleElement);
      container.appendChild(clonedResume);
      document.body.appendChild(container);
      
      // Preserve original styles on the cloned element
      clonedResume.style.transform = 'none';
      clonedResume.style.transition = 'none';
      clonedResume.style.width = `${resumeWidth}px`;
      clonedResume.style.height = `${resumeHeight}px`;
      clonedResume.style.position = 'relative';
      clonedResume.style.margin = '0';
      clonedResume.style.padding = '0';
      
      try {
        // Wait for all images to load
        await Promise.all(
          Array.from(clonedResume.querySelectorAll('img'))
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            }))
        );
        
        // Wait for fonts to load
        if ((document as any).fonts && (document as any).fonts.ready) {
          await (document as any).fonts.ready;
        } else {
          // Fallback if document.fonts is not available
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Wait a bit more to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture the resume
        const canvas = await html2canvas(clonedResume, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          imageTimeout: 30000,
          onclone: (clonedDoc) => {
            // Additional processing if needed
            return Promise.resolve();
          },
        });
        
        // A4 size in mm
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // Create PDF
        const pdf = new jsPDF({
          format: 'a4',
          unit: 'mm',
          orientation: 'portrait',
        });
        
        // Calculate scaling to fit content to A4
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
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
        
        // Add image to PDF
        pdf.addImage(
          imgData,
          'JPEG',
          offsetX,
          offsetY,
          imgWidth,
          imgHeight
        );
        
        // Save PDF
        pdf.save('resume.pdf');
        
        // Success message
        toast.dismiss(loadingToast);
        toast.success("PDF downloaded successfully!");
      } catch (err) {
        console.error("Error during canvas capture:", err);
        toast.dismiss(loadingToast);
        toast.error("Failed to generate PDF. Please try again.");
      } finally {
        // Clean up
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
      }
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
