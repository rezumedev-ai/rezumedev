
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
import { DynamicTypography } from "@/components/ui/dynamic-typography";

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

      // Get template ID to apply template-specific optimizations
      const templateId = resumeElement.getAttribute('data-template-id') || 'minimal-clean';
      
      // Wait for fonts to load to prevent missing text in the PDF
      await document.fonts.ready;
      
      // Add a PDF generation class to make specific PDF optimizations via CSS
      resumeElement.classList.add('pdf-generation-mode');
      
      // Apply template-specific optimizations
      optimizeForPdf(resumeElement, templateId);
      
      // Improved capture settings for better quality
      const pixelRatio = window.devicePixelRatio || 1;
      const captureScale = getOptimalScaleForTemplate(templateId, pixelRatio);
      
      // Capture the resume content
      const canvas = await html2canvas(resumeElement, {
        scale: captureScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        // Ensure all fonts and images are loaded
        onclone: (clonedDoc) => {
          return new Promise<void>(resolve => {
            setTimeout(resolve, 500);
          });
        }
      }).catch(error => {
        console.error("HTML2Canvas error:", error);
        toast.error("Failed to generate PDF. Try a different template.");
        throw error;
      });
      
      // Remove the PDF generation class after capturing
      resumeElement.classList.remove('pdf-generation-mode');
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate canvas aspect ratio for proper scaling
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const canvasAspectRatio = canvas.width / canvas.height;
      const a4AspectRatio = pdfWidth / pdfHeight;
      
      // Add image to PDF with proper scaling
      if (canvasAspectRatio < a4AspectRatio) {
        // If canvas is taller than A4 proportionally, fit to height
        const imgHeight = pdfHeight;
        const imgWidth = imgHeight * canvasAspectRatio;
        const offsetX = (pdfWidth - imgWidth) / 2;
        
        pdf.addImage(imgData, 'JPEG', offsetX, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // If canvas is wider than A4 proportionally, fit to width
        const imgWidth = pdfWidth;
        const imgHeight = imgWidth / canvasAspectRatio;
        // Center vertically if there's extra space
        const offsetY = Math.max(0, (pdfHeight - imgHeight) / 2);
        
        pdf.addImage(imgData, 'JPEG', 0, offsetY, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // Save the PDF
      pdf.save('resume.pdf');
      
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Helper function to get optimal scale based on template
  const getOptimalScaleForTemplate = (templateId: string, pixelRatio: number): number => {
    switch(templateId) {
      case 'minimal-elegant':
      case 'executive-clean':
        // Higher scale for text-heavy templates
        return pixelRatio * 2.5;
      case 'professional-navy':
        return pixelRatio * 2.2;
      case 'modern-professional':
        return pixelRatio * 2;
      default:
        return pixelRatio * 2;
    }
  };

  // Function to apply template-specific optimizations before PDF generation
  const optimizeForPdf = (element: HTMLElement, templateId: string): void => {
    // Replace SVG icons with text characters for better PDF compatibility
    const replaceIconsWithSymbols = () => {
      // Contact icons
      const contactIcons = element.querySelectorAll('[data-pdf-contact-icon="true"]');
      contactIcons.forEach(icon => {
        const iconElement = icon as HTMLElement;
        const svg = iconElement.querySelector('svg');
        if (svg) {
          const iconType = svg.getAttribute('data-lucide') || '';
          let iconSymbol = '';
          
          switch (iconType.toLowerCase()) {
            case 'mail': iconSymbol = '✉'; break;
            case 'phone': iconSymbol = '☎'; break;
            case 'linkedin': iconSymbol = 'in'; break;
            case 'globe': iconSymbol = '🌐'; break;
            default: iconSymbol = '•'; break;
          }
          
          const iconSpan = document.createElement('span');
          iconSpan.textContent = iconSymbol;
          iconSpan.className = 'pdf-icon-text';
          iconSpan.style.marginRight = '6px';
          iconSpan.style.display = 'inline-block';
          
          if (iconElement.contains(svg)) {
            iconElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // Section icons
      const sectionIcons = element.querySelectorAll('[data-pdf-section-icon="true"]');
      sectionIcons.forEach(icon => {
        const iconElement = icon as HTMLElement;
        const svg = iconElement.querySelector('svg');
        if (svg) {
          const iconType = svg.getAttribute('data-lucide') || '';
          let iconSymbol = '';
          
          switch (iconType.toLowerCase()) {
            case 'briefcase': iconSymbol = '💼'; break;
            case 'graduation-cap': iconSymbol = '🎓'; break;
            case 'award': iconSymbol = '🏆'; break;
            case 'code': iconSymbol = '💻'; break;
            case 'file-text': iconSymbol = '📄'; break;
            case 'user': iconSymbol = '👤'; break;
            default: iconSymbol = '•'; break;
          }
          
          const iconSpan = document.createElement('span');
          iconSpan.textContent = iconSymbol;
          iconSpan.className = 'pdf-icon-text';
          iconSpan.style.marginRight = '8px';
          
          if (iconElement.contains(svg)) {
            iconElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // Bullet points
      const bulletPoints = element.querySelectorAll('[data-pdf-bullet="true"]');
      bulletPoints.forEach(bullet => {
        const bulletElement = bullet as HTMLElement;
        bulletElement.textContent = '•';
        bulletElement.style.width = 'auto';
        bulletElement.style.display = 'inline-block';
        bulletElement.style.marginRight = '6px';
      });

      // Optimize bullet lists
      const bulletLists = element.querySelectorAll('[data-pdf-bullet-list="true"]');
      bulletLists.forEach(list => {
        const listElement = list as HTMLElement;
        listElement.style.marginLeft = '0';
        listElement.style.paddingLeft = '0';
        listElement.style.listStyle = 'none';
      });
    };
    
    // Apply template-specific styling optimizations
    const applyTemplateSpecificOptimizations = () => {
      // Basic optimizations for all templates
      const sections = element.querySelectorAll('[data-section]');
      sections.forEach(section => {
        const sectionElement = section as HTMLElement;
        sectionElement.style.pageBreakInside = 'avoid';
        sectionElement.style.marginBottom = '0.5rem';
      });
      
      // Template-specific optimizations
      switch(templateId) {
        case 'minimal-elegant':
        case 'executive-clean':
          // These templates need more aggressive optimization
          // Reduce spacing in experience sections
          const expItems = element.querySelectorAll('[data-experience-item="true"]');
          expItems.forEach(item => {
            const itemEl = item as HTMLElement;
            itemEl.style.marginBottom = '0.4rem';
            
            // Make responsibility lists more compact
            const respList = itemEl.querySelector('ul');
            if (respList) {
              const listEl = respList as HTMLElement;
              listEl.style.marginTop = '0.2rem';
              listEl.style.marginBottom = '0.2rem';
              
              // Make list items more compact
              const listItems = listEl.querySelectorAll('li');
              listItems.forEach(li => {
                const liElem = li as HTMLElement;
                liElem.style.fontSize = '11px';
                liElem.style.marginBottom = '0.1rem';
                liElem.style.lineHeight = '1.2';
              });
            }
          });
          
          // Optimize certifications
          const certItems = element.querySelectorAll('[data-cert-item="true"]');
          certItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.15rem';
            
            const textElements = itemElem.querySelectorAll('div');
            textElements.forEach(div => {
              const divElem = div as HTMLElement;
              divElem.style.fontSize = '11px';
              divElem.style.lineHeight = '1.2';
            });
          });
          
          // Optimize education items
          const eduItems = element.querySelectorAll('[data-edu-item="true"]');
          eduItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.15rem';
            itemElem.style.paddingBottom = '0.1rem';
          });
          break;
          
        case 'professional-navy':
          // Optimize the navy template
          const navyTextElements = element.querySelectorAll('p, li, span, div:not([class*="grid"])');
          navyTextElements.forEach(el => {
            const elemStyle = (el as HTMLElement).style;
            if (elemStyle.fontSize) {
              const currentSize = parseFloat(elemStyle.fontSize);
              elemStyle.fontSize = `${currentSize * 0.95}px`;
            }
          });
          break;
      }
    };
    
    // Replace icons with symbols for better PDF compatibility
    replaceIconsWithSymbols();
    
    // Apply template-specific optimizations
    applyTemplateSpecificOptimizations();
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
