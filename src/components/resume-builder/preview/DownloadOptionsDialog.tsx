
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

      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the exact dimensions of the original element
      const originalWidth = resumeElement.offsetWidth;
      const originalHeight = resumeElement.offsetHeight;

      // Get template ID to apply template-specific optimizations
      const templateId = resumeElement.getAttribute('data-template-id') || 'minimal-clean';

      // Create a clone with exact A4 proportions to ensure consistency
      const clonedResume = resumeElement.cloneNode(true) as HTMLElement;
      clonedResume.id = 'pdf-preparation-div';
      clonedResume.style.position = 'absolute';
      clonedResume.style.left = '-9999px';
      // Set exact dimensions to match A4 aspect ratio while preserving content
      clonedResume.style.width = `${originalWidth}px`;
      clonedResume.style.height = `${originalHeight}px`;
      clonedResume.style.margin = '0';
      clonedResume.style.padding = '0';
      clonedResume.style.overflow = 'hidden';
      clonedResume.className = resumeElement.className + ' pdf-mode';

      document.body.appendChild(clonedResume);

      // First check if we need to adjust font sizes for problematic templates
      if (['minimal-elegant', 'executive-clean'].includes(templateId)) {
        // Find sections that might cause overflow issues
        const skillsSection = clonedResume.querySelector('[data-section="skills"]');
        const certSection = clonedResume.querySelector('[data-section="certifications"]');

        if (skillsSection) {
          // Adjust skills section font sizes if needed
          const skillHeadings = skillsSection.querySelectorAll('h4');
          skillHeadings.forEach(heading => {
            const headingElem = heading as HTMLElement;
            if (headingElem.style.fontSize) {
              const currentSize = parseFloat(headingElem.style.fontSize);
              headingElem.style.fontSize = `${Math.max(currentSize * 0.85, 10)}px`;
            }
          });

          // Find skill lists and adjust their text size
          const skillLists = skillsSection.querySelectorAll('.pdf-bullet-list');
          skillLists.forEach(list => {
            const listElem = list as HTMLElement;
            const items = listElem.querySelectorAll('li');
            items.forEach(item => {
              const itemElem = item as HTMLElement;
              itemElem.style.fontSize = '10px';
              itemElem.style.lineHeight = '1.2';
              itemElem.style.marginBottom = '2px';
            });
          });
        }

        if (certSection) {
          // Adjust certification section font sizes
          const certItems = certSection.querySelectorAll('div');
          certItems.forEach(item => {
            const itemElem = item as HTMLElement;
            // Only adjust actual certification items, not containers
            if (itemElem.classList.contains('flex')) {
              const textElements = itemElem.querySelectorAll('span');
              textElements.forEach(span => {
                const spanElem = span as HTMLElement;
                spanElem.style.fontSize = '10px';
              });
            }
          });
        }

        // Check for any education section that might need adjustment
        const educationSection = clonedResume.querySelector('[data-section="education"]');
        if (educationSection) {
          const dateTexts = educationSection.querySelectorAll('.text-gray-500');
          dateTexts.forEach(date => {
            const dateElem = date as HTMLElement;
            dateElem.style.fontSize = '10px';
          });
        }
      }

      // Find all hyperlinks in the cloned resume to add them to the PDF later
      const links: { url: string, left: number, top: number, width: number, height: number }[] = [];
      const pdfLinkElements = clonedResume.querySelectorAll('[data-pdf-link="true"]');
      pdfLinkElements.forEach((linkElement, index) => {
        const element = linkElement as HTMLElement;
        // Replace link tag with span to avoid issues with html2canvas
        const linkUrl = element.getAttribute('href') || '';
        const linkText = element.textContent || '';

        // Collect link info for later
        const rect = element.getBoundingClientRect();
        const offsetTop = element.offsetTop;
        const offsetLeft = element.offsetLeft;
        const parent = element.parentElement;

        // Store link details
        links.push({
          url: linkUrl,
          left: offsetLeft,
          top: offsetTop,
          width: rect.width,
          height: rect.height
        });

        // Replace link with span
        const span = document.createElement('span');
        span.innerText = linkText;
        span.className = element.className + ' pdf-hyperlink';
        span.style.color = '#0000EE'; // Standard link blue color
        span.style.textDecoration = 'underline';
        span.dataset.linkIndex = index.toString();

        if (parent) {
          parent.replaceChild(span, element);
        }
      });

      const contactIcons = clonedResume.querySelectorAll('[data-pdf-contact-icon="true"]');
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
          iconSpan.style.fontSize = '14px';
          iconSpan.style.display = 'inline-block';
          iconSpan.style.verticalAlign = 'middle';
          iconSpan.style.lineHeight = '1';

          if (iconElement.contains(svg)) {
            iconElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // Force alignment fix for html2canvas
      // "Still High" with 4.5px -> Push it DOWN MORE.
      // Increasing to 6px to force it to line center.
      const bulletWrappers = clonedResume.querySelectorAll('[data-pdf-wrapper="true"]');
      bulletWrappers.forEach(wrapper => {
        const el = wrapper as HTMLElement;
        el.style.position = 'relative';
        el.style.top = '6px'; // Major push down
      });

      const bulletLists = clonedResume.querySelectorAll('[data-pdf-bullet-list="true"]');
      bulletLists.forEach(list => {
        const listElement = list as HTMLElement;
        listElement.style.marginLeft = '0';
        listElement.style.paddingLeft = '0';
        listElement.style.listStyle = 'none';
      });

      const bulletItems = clonedResume.querySelectorAll('.pdf-bullet-item');
      bulletItems.forEach(item => {
        const itemElement = item as HTMLElement;
        // Explicitly enforce flex-start to ensure the line-height wrapper sits at the top
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'flex-start';
        itemElement.style.marginBottom = '4px';
      });

      const sectionIcons = clonedResume.querySelectorAll('[data-pdf-section-icon="true"]');
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
            case 'folder-kanban': iconSymbol = '📂'; break;
            default: iconSymbol = '•'; break;
          }

          const iconSpan = document.createElement('span');
          iconSpan.textContent = iconSymbol;
          iconSpan.className = 'pdf-icon-text';
          iconSpan.style.marginRight = '8px';
          iconSpan.style.fontSize = '14px';
          iconSpan.style.display = 'inline-block';
          iconSpan.style.verticalAlign = 'middle';
          iconSpan.style.lineHeight = '1';

          if (iconElement.contains(svg)) {
            iconElement.replaceChild(iconSpan, svg);
          }
        }
      });

      // Check if we need to apply content length optimizations
      const contentOptimization = () => {
        // Find sections that might contain a lot of content
        const experienceSection = clonedResume.querySelector('[data-section="experience"]');
        if (experienceSection) {
          const experienceItems = experienceSection.querySelectorAll('[data-experience-item="true"]');

          // If there are many experience items, we need to adjust spacing
          if (experienceItems.length > 3) {
            experienceItems.forEach(item => {
              const itemElem = item as HTMLElement;
              // Reduce margins between items
              itemElem.style.marginBottom = '6px';

              // Find responsibility lists and adjust their spacing
              const respList = itemElem.querySelector('ul');
              if (respList) {
                const respListElem = respList as HTMLElement;
                respListElem.style.marginTop = '2px';

                // Make responsibility text smaller
                const listItems = respListElem.querySelectorAll('li');
                listItems.forEach(li => {
                  const liElem = li as HTMLElement;
                  liElem.style.fontSize = '10px';
                  liElem.style.marginBottom = '1px';
                  liElem.style.lineHeight = '1.2';
                });
              }
            });
          }
        }

        // Handle long skills lists
        const skillsList = clonedResume.querySelectorAll('[data-skill-item="true"]');
        if (skillsList.length > 15) {
          skillsList.forEach(skill => {
            const skillElem = skill as HTMLElement;
            skillElem.style.fontSize = '10px';
            skillElem.style.lineHeight = '1.1';
          });
        }
      };

      // Apply content-based optimizations
      contentOptimization();

      // Improved canvas capture settings with higher resolution and quality
      const pixelRatio = window.devicePixelRatio || 1;

      const captureSettings = {
        scale: pixelRatio * 3, // Increased scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        logging: false, // Disable logging for better performance
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

      // A4 dimensions in mm
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Calculate the correct scaling from canvas to PDF to maintain aspect ratio
      // and ensure content fills the width without unnecessary white space
      const canvasAspectRatio = canvas.width / canvas.height;
      const a4AspectRatio = pdfWidth / pdfHeight;

      // Check if content is too tall for A4 height
      let imgWidth, imgHeight, offsetX = 0;

      if (canvasAspectRatio < a4AspectRatio) {
        // Content is taller than A4 proportions - we need to scale to fit height
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
        offsetX = (pdfWidth - imgWidth) / 2; // Center horizontally
      } else {
        // Content fits within A4 proportions or is wider - use full width
        imgWidth = pdfWidth;
        imgHeight = imgWidth / canvasAspectRatio;
      }

      pdf.addImage(
        imgData,
        'JPEG',
        offsetX, // Center horizontally if needed
        0, // Align to top
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      // Add hyperlinks to the PDF
      if (links.length > 0) {
        // Calculate scale ratio between canvas and PDF
        const scaleX = imgWidth / originalWidth;
        const scaleY = imgHeight / originalHeight;

        links.forEach(link => {
          // Convert link position from original coordinates to PDF coordinates
          const pdfX = offsetX + (link.left * scaleX);
          const pdfY = link.top * scaleY;
          const pdfWidth = link.width * scaleX;
          const pdfHeight = link.height * scaleY;

          // Add clickable link area to the PDF
          pdf.link(pdfX, pdfY, pdfWidth, pdfHeight, { url: link.url });
        });
      }

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
