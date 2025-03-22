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
      // Get the resume element
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

      // 1. Clone the resume content to avoid modifying the original
      const originalHtml = resumeElement.innerHTML;
      const pdfPreparationDiv = document.createElement('div');
      pdfPreparationDiv.id = 'pdf-preparation-div';
      pdfPreparationDiv.style.position = 'absolute';
      pdfPreparationDiv.style.left = '-9999px';
      pdfPreparationDiv.style.width = `${resumeElement.offsetWidth}px`;
      pdfPreparationDiv.style.height = `${resumeElement.offsetHeight}px`;
      pdfPreparationDiv.style.overflow = 'hidden';
      pdfPreparationDiv.innerHTML = originalHtml;
      pdfPreparationDiv.className = resumeElement.className + ' pdf-mode';
      
      // Add additional padding for professional appearance
      pdfPreparationDiv.style.padding = '32px 40px';
      document.body.appendChild(pdfPreparationDiv);

      // 2. Pre-process PDF for proper rendering of section icons
      const sectionIcons = pdfPreparationDiv.querySelectorAll('[data-pdf-section-icon="true"]');
      sectionIcons.forEach(icon => {
        const iconElement = icon as HTMLElement;
        // Check if contains an SVG
        const svg = iconElement.querySelector('svg');
        if (svg) {
          // Get the icon type from data attribute or class if possible
          const iconType = svg.getAttribute('data-pdf-section-icon-type') || '';
          
          // Create a span with appropriate icon symbol
          const iconSpan = document.createElement('span');
          
          // Map icon types to Unicode symbols
          switch (iconType.toLowerCase()) {
            case 'briefcase': 
              iconSpan.textContent = '💼';
              break;
            case 'education': 
              iconSpan.textContent = '🎓';
              break;
            case 'certification': 
              iconSpan.textContent = '🏆';
              break;
            case 'skills': 
              iconSpan.textContent = '💻';
              break;
            case 'summary': 
              iconSpan.textContent = '📄';
              break;
            case 'profile': 
              iconSpan.textContent = '👤';
              break;
            case 'projects': 
              iconSpan.textContent = '📂';
              break;
            default:
              // Default for any unrecognized icon
              iconSpan.textContent = '•';
          }
          
          iconSpan.className = 'pdf-icon-text';
          iconSpan.style.marginRight = '8px';
          iconSpan.style.fontSize = '14px';
          
          // Replace the SVG with our text representation
          if (iconElement.contains(svg)) {
            iconElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // 3. Fix bullet points for skills with chevron
      const skillBullets = pdfPreparationDiv.querySelectorAll('[data-pdf-bullet-type="skill"]');
      skillBullets.forEach(bullet => {
        const bulletElement = bullet as HTMLElement;
        // Replace chevron icon with right arrow symbol for skills
        const chevronIcon = bulletElement.querySelector('[data-pdf-bullet-icon="chevron"]');
        if (chevronIcon) {
          const arrowSpan = document.createElement('span');
          arrowSpan.textContent = '→';
          arrowSpan.style.fontSize = '12px';
          arrowSpan.style.marginRight = '4px';
          arrowSpan.style.color = '#555';
          bulletElement.replaceChild(arrowSpan, chevronIcon);
        } else {
          // Fallback if chevron element isn't found
          bulletElement.textContent = '→';
          bulletElement.style.fontSize = '12px';
          bulletElement.style.marginRight = '4px';
          bulletElement.style.marginTop = '2px';
          bulletElement.style.color = '#555';
        }
      });

      // 4. Fix regular bullet points
      const regularBullets = pdfPreparationDiv.querySelectorAll('[data-pdf-bullet-type="default"]');
      regularBullets.forEach(bullet => {
        const bulletElement = bullet as HTMLElement;
        // Replace div bullet with a text bullet
        bulletElement.textContent = '•';
        bulletElement.style.width = 'auto';
        bulletElement.style.height = 'auto';
        bulletElement.style.display = 'inline-block';
        bulletElement.style.marginRight = '6px';
        bulletElement.style.marginTop = '0px';
        bulletElement.style.fontSize = '16px';
        bulletElement.style.lineHeight = '1';
        bulletElement.className = 'pdf-bullet-char';
      });

      // 5. Fix bullet lists
      const bulletLists = pdfPreparationDiv.querySelectorAll('[data-pdf-bullet-list="true"]');
      bulletLists.forEach(list => {
        const listElement = list as HTMLElement;
        listElement.style.marginLeft = '0';
        listElement.style.paddingLeft = '0';
        listElement.style.listStyle = 'none';
      });

      // 6. Fix bullet items
      const bulletItems = pdfPreparationDiv.querySelectorAll('.pdf-bullet-item');
      bulletItems.forEach(item => {
        const itemElement = item as HTMLElement;
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'flex-start';
        itemElement.style.marginBottom = '4px';
      });

      // 7. Fix contact info alignment in the header 
      const contactInfo = pdfPreparationDiv.querySelectorAll('.contact-item');
      contactInfo.forEach(item => {
        const itemElement = item as HTMLElement;
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'center';
        
        // Find any SVG icon and replace it with appropriate Unicode
        const svg = itemElement.querySelector('svg');
        if (svg) {
          const iconType = svg.getAttribute('data-lucide') || '';
          const iconSpan = document.createElement('span');
          
          switch (iconType.toLowerCase()) {
            case 'mail': iconSpan.textContent = '✉️'; break;
            case 'phone': iconSpan.textContent = '📞'; break;
            case 'linkedin': iconSpan.textContent = 'in'; break;
            case 'globe': iconSpan.textContent = '🌐'; break;
            case 'map-pin': iconSpan.textContent = '📍'; break;
            default: iconSpan.textContent = '•';
          }
          
          iconSpan.style.marginRight = '4px';
          iconSpan.style.fontSize = '12px';
          
          const parentElement = svg.parentElement;
          if (parentElement) {
            parentElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // Get device pixel ratio for better quality
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Capture settings
      const captureSettings = {
        scale: pixelRatio * 2.5, // Increase scale for higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDoc: Document) => {
          // Additional processing for the cloned document if needed
          return new Promise<void>(resolve => {
            if ((document as any).fonts && (document as any).fonts.ready) {
              (document as any).fonts.ready.then(() => {
                setTimeout(resolve, 500); // Ensure fonts and icons are loaded
              });
            } else {
              setTimeout(resolve, 500);
            }
          });
        }
      };

      // 8. Capture the prepared element
      const canvas = await html2canvas(pdfPreparationDiv, captureSettings);
      
      // 9. Remove the preparation div
      document.body.removeChild(pdfPreparationDiv);

      // 10. Create PDF with the exact A4 dimensions
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate dimensions to maintain aspect ratio
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
