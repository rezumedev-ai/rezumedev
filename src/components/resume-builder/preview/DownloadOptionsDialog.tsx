
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
    
    if (!hasActiveSubscription) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    try {
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        console.error("Could not find element with id 'resume-content'");
        toast.error("Could not find resume content. Please try again later.");
        return;
      }

      const loadingToast = toast.loading("Generating PDF...");

      await new Promise(resolve => setTimeout(resolve, 500));

      const clonedResume = resumeElement.cloneNode(true) as HTMLElement;
      clonedResume.id = 'pdf-preparation-div';
      clonedResume.style.position = 'absolute';
      clonedResume.style.left = '-9999px';
      clonedResume.style.width = `${resumeElement.offsetWidth}px`;
      clonedResume.style.height = `${resumeElement.offsetHeight}px`;
      clonedResume.style.overflow = 'hidden';
      clonedResume.className = resumeElement.className + ' pdf-mode';
      
      clonedResume.style.padding = '32px 32px 0 32px'; 
      
      document.body.appendChild(clonedResume);

      // Enhanced icon handling for PDF export - replaces ALL icons with text symbols
      const replaceAllIcons = (element: HTMLElement) => {
        // Replace contact icons
        const contactIcons = element.querySelectorAll('[data-pdf-contact-icon="true"], [data-lucide]');
        contactIcons.forEach(icon => {
          const iconElement = icon as HTMLElement;
          const svg = iconElement.querySelector('svg');
          if (svg) {
            const iconType = svg.getAttribute('data-lucide') || '';
            let iconSymbol = '•';
            
            // Map all possible icon types to appropriate symbols
            switch (iconType.toLowerCase()) {
              case 'mail': iconSymbol = '✉'; break;
              case 'phone': iconSymbol = '☎'; break;
              case 'linkedin': iconSymbol = 'in'; break;
              case 'globe': iconSymbol = '🌐'; break;
              case 'briefcase': iconSymbol = '💼'; break;
              case 'graduation-cap': iconSymbol = '🎓'; break;
              case 'award': iconSymbol = '🏆'; break;
              case 'code': iconSymbol = '💻'; break;
              case 'file-text': iconSymbol = '📄'; break;
              case 'user': iconSymbol = '👤'; break;
              case 'folder-kanban': iconSymbol = '📂'; break;
              case 'chevron-right': iconSymbol = '›'; break;
              case 'arrow-right': iconSymbol = '→'; break;
              default: iconSymbol = '•'; break;
            }
            
            const iconSpan = document.createElement('span');
            iconSpan.textContent = iconSymbol;
            iconSpan.className = 'pdf-icon-text';
            iconSpan.style.display = 'inline-flex';
            iconSpan.style.alignItems = 'center';
            iconSpan.style.justifyContent = 'center';
            iconSpan.style.verticalAlign = 'middle';
            iconSpan.style.marginRight = '6px';
            iconSpan.style.fontSize = '14px';
            iconSpan.style.lineHeight = '1';
            
            // For section headers, use different styling
            if (iconElement.hasAttribute('data-pdf-section-icon')) {
              iconSpan.style.marginRight = '8px';
            }
            
            if (iconElement.contains(svg)) {
              iconElement.replaceChild(iconSpan, svg);
            }
          }
        });

        // Fix bullet points
        const bulletPoints = element.querySelectorAll('[data-pdf-bullet="true"]');
        bulletPoints.forEach(bullet => {
          const bulletElement = bullet as HTMLElement;
          bulletElement.textContent = '•';
          bulletElement.style.width = 'auto';
          bulletElement.style.height = 'auto';
          bulletElement.style.display = 'inline-block';
          bulletElement.style.marginRight = '6px';
          bulletElement.style.marginTop = '0';
          bulletElement.style.fontSize = '16px';
          bulletElement.style.lineHeight = '1';
          bulletElement.style.verticalAlign = 'middle';
          bulletElement.className = 'pdf-bullet-char';
        });
      };

      // Apply the icon replacements
      replaceAllIcons(clonedResume);

      // Ensure all contact wrappers have proper styling
      const contactWrappers = clonedResume.querySelectorAll('[data-pdf-contact-wrapper="true"]');
      contactWrappers.forEach(wrapper => {
        const wrapperElement = wrapper as HTMLElement;
        wrapperElement.style.display = 'flex';
        wrapperElement.style.alignItems = 'center';
        wrapperElement.style.gap = '4px';
        wrapperElement.style.lineHeight = '1.5';
        wrapperElement.style.marginBottom = '4px';
      });

      // Fix bullet lists
      const bulletLists = clonedResume.querySelectorAll('[data-pdf-bullet-list="true"]');
      bulletLists.forEach(list => {
        const listElement = list as HTMLElement;
        listElement.style.marginLeft = '0';
        listElement.style.paddingLeft = '0';
        listElement.style.listStyle = 'none';
      });

      // Fix bullet items
      const bulletItems = clonedResume.querySelectorAll('.pdf-bullet-item');
      bulletItems.forEach(item => {
        const itemElement = item as HTMLElement;
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'flex-start';
        itemElement.style.marginBottom = '4px';
        itemElement.style.pageBreakInside = 'avoid';
      });

      // Add specific template fixes based on class names
      if (clonedResume.querySelector('.professional-navy-contact-icon')) {
        const navyIcons = clonedResume.querySelectorAll('.professional-navy-contact-icon');
        navyIcons.forEach(icon => {
          const iconElement = icon as HTMLElement;
          iconElement.style.display = 'inline-flex';
          iconElement.style.alignItems = 'center';
          iconElement.style.justifyContent = 'center';
          iconElement.style.verticalAlign = 'middle';
          iconElement.style.marginRight = '6px';
        });
      }

      const pixelRatio = window.devicePixelRatio || 1;
      
      const captureSettings = {
        scale: pixelRatio * 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDoc: Document) => {
          return new Promise<void>(resolve => {
            if ((document as any).fonts && (document as any).fonts.ready) {
              (document as any).fonts.ready.then(() => {
                setTimeout(resolve, 500);
              });
            } else {
              setTimeout(resolve, 500);
            }
          });
        }
      };

      const canvas = await html2canvas(clonedResume, captureSettings);
      
      document.body.removeChild(clonedResume);

      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const canvasAspectRatio = canvas.width / canvas.height;
      const a4AspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight, offsetX, offsetY;
      
      if (canvasAspectRatio > a4AspectRatio) {
        imgWidth = pdfWidth;
        imgHeight = imgWidth / canvasAspectRatio;
        offsetX = 0;
        offsetY = (pdfHeight - imgHeight) / 2;
      } else {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
        offsetX = (pdfWidth - imgWidth) / 2;
        offsetY = 0;
      }
      
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

      pdf.save('resume.pdf');
      
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
