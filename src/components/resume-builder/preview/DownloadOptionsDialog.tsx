
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
      
      // Template-specific PDF optimizations
      const applyTemplateSpecificOptimizations = () => {
        // Base settings for all templates to match modern-professional's efficiency
        clonedResume.style.width = `${originalWidth}px`;
        clonedResume.style.margin = '0';
        clonedResume.style.padding = '0';
        clonedResume.style.overflow = 'hidden';
        clonedResume.className = resumeElement.className + ' pdf-mode';
        
        // Template-specific optimizations
        switch(templateId) {
          case 'executive-clean':
            // Reduce margins to maximize space usage
            const execCleanContent = clonedResume.querySelector('[data-section="skills"], [data-section="education"], [data-section="experience"]');
            if (execCleanContent) {
              const contentElement = execCleanContent as HTMLElement;
              contentElement.style.marginTop = '0.25rem';
              contentElement.style.marginBottom = '0.25rem';
            }
            
            // Adjust padding for executive-clean to reduce white space
            const execCleanSections = clonedResume.querySelectorAll('section');
            execCleanSections.forEach(section => {
              const sectionElement = section as HTMLElement;
              sectionElement.style.marginBottom = '0.75rem';
            });
            
            // Set height to match US Legal aspect ratio for this template
            clonedResume.style.height = `${originalHeight * 0.95}px`;
            break;
            
          case 'minimal-elegant':
            // Reduce white space by adjusting margins
            const minElegantContent = clonedResume.querySelectorAll('section, div[class*="space-y"]');
            minElegantContent.forEach(element => {
              const el = element as HTMLElement;
              // Reduce vertical spacing between sections
              if (el.style.marginBottom) {
                const currentMargin = parseFloat(el.style.marginBottom);
                el.style.marginBottom = `${currentMargin * 0.8}px`;
              }
              
              // Reduce spacing inside lists
              const lists = el.querySelectorAll('ul, ol');
              lists.forEach(list => {
                const listElement = list as HTMLElement;
                listElement.style.marginTop = '0.25rem';
                listElement.style.marginBottom = '0.25rem';
              });
            });
            
            // Reduce unnecessary horizontal spacing
            const contentContainer = clonedResume.querySelector('div[style*="position: absolute"]');
            if (contentContainer) {
              const containerEl = contentContainer as HTMLElement;
              const currentLeft = parseFloat(containerEl.style.left || '0.5in');
              const currentRight = parseFloat(containerEl.style.right || '0.5in');
              
              // Reduce horizontal margins slightly to maximize content width
              containerEl.style.left = `${currentLeft * 0.9}in`;
              containerEl.style.right = `${currentRight * 0.9}in`;
            }
            
            // Set height to match US Legal aspect ratio for this template
            clonedResume.style.height = `${originalHeight * 0.95}px`;
            break;
            
          case 'professional-navy':
            // The professional-navy template needs special handling for content overflow
            // Reduce font size of all text to fit more content
            const allTextElements = clonedResume.querySelectorAll('p, li, span, div:not([class*="grid"])');
            allTextElements.forEach(element => {
              const el = element as HTMLElement;
              if (el.style.fontSize) {
                // If font size is specified, reduce it by 5%
                const currentSize = parseFloat(el.style.fontSize);
                el.style.fontSize = `${currentSize * 0.95}px`;
              }
            });
            
            // Compress spacing between sections to fit more content
            const sections = clonedResume.querySelectorAll('section, div[class*="space-y"], div[class*="mb-"]');
            sections.forEach(section => {
              const sectionElement = section as HTMLElement;
              if (sectionElement.style.marginBottom) {
                const currentMargin = parseFloat(sectionElement.style.marginBottom);
                sectionElement.style.marginBottom = `${currentMargin * 0.85}px`;
              }
              if (sectionElement.style.paddingBottom) {
                const currentPadding = parseFloat(sectionElement.style.paddingBottom);
                sectionElement.style.paddingBottom = `${currentPadding * 0.85}px`;
              }
            });
            
            // Reduce spacing in lists to fit more content
            const lists = clonedResume.querySelectorAll('ul, ol');
            lists.forEach(list => {
              const listElement = list as HTMLElement;
              listElement.style.marginBottom = '0.25rem';
              
              const items = listElement.querySelectorAll('li');
              items.forEach(item => {
                const itemElement = item as HTMLElement;
                itemElement.style.marginBottom = '0.15rem';
                itemElement.style.lineHeight = '1.25';
              });
            });
            
            // Set height to match A4 aspect ratio but account for more content
            clonedResume.style.height = `${originalHeight}px`;
            break;
            
          case 'modern-professional':
            // Modern professional already works well, just preserve its settings
            clonedResume.style.height = `${originalHeight}px`;
            break;
            
          default:
            // Default handling for other templates
            clonedResume.style.height = `${originalHeight}px`;
        }
      };
      
      // Apply template-specific PDF optimizations
      applyTemplateSpecificOptimizations();
      
      document.body.appendChild(clonedResume);
      
      // First check if we need to adjust font sizes for problematic templates
      if (['minimal-elegant', 'executive-clean', 'professional-navy'].includes(templateId)) {
        // Find sections that might cause overflow issues
        const skillsSection = clonedResume.querySelector('[data-section="skills"]');
        const certSection = clonedResume.querySelector('[data-section="certifications"]');
        const summarySection = clonedResume.querySelector('[data-section="summary"]');
        
        // Adjust skills section font sizes for better space utilization
        if (skillsSection) {
          // Adjust skills section font sizes if needed
          const skillHeadings = skillsSection.querySelectorAll('h4');
          skillHeadings.forEach(heading => {
            const headingElem = heading as HTMLElement;
            headingElem.style.fontSize = `14px`;
            headingElem.style.marginBottom = '0.25rem';
          });
          
          // Find skill lists and optimize their display
          const skillLists = skillsSection.querySelectorAll('.pdf-bullet-list');
          skillLists.forEach(list => {
            const listElem = list as HTMLElement;
            listElem.style.marginTop = '0.25rem';
            
            const items = listElem.querySelectorAll('li');
            items.forEach(item => {
              const itemElem = item as HTMLElement;
              itemElem.style.fontSize = '12px';
              itemElem.style.lineHeight = '1.2';
              itemElem.style.marginBottom = '0.15rem';
            });
          });
        }
        
        // Optimize certifications display
        if (certSection) {
          // Make certification section more compact
          const certItems = certSection.querySelectorAll('li');
          certItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.25rem';
            
            // Adjust text size in certifications
            const textElements = itemElem.querySelectorAll('div');
            textElements.forEach(div => {
              const divElem = div as HTMLElement;
              divElem.style.fontSize = '12px';
              divElem.style.lineHeight = '1.2';
            });
          });
        }
        
        // Optimize professional summary to be more space-efficient
        if (summarySection) {
          const summaryText = summarySection.querySelector('div[contenteditable]') || summarySection.querySelector('p');
          if (summaryText) {
            const textElem = summaryText as HTMLElement;
            textElem.style.fontSize = '12px';
            textElem.style.lineHeight = '1.3';
            textElem.style.marginBottom = '0.5rem';
          }
        }
        
        // Check for education section that might need adjustment
        const educationSection = clonedResume.querySelector('[data-section="education"]');
        if (educationSection) {
          const eduItems = educationSection.querySelectorAll('div[class*="flex"]');
          eduItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.25rem';
          });
          
          const dateTexts = educationSection.querySelectorAll('.text-gray-500');
          dateTexts.forEach(date => {
            const dateElem = date as HTMLElement;
            dateElem.style.fontSize = '11px';
          });
        }
        
        // Optimize experience section for space efficiency
        const experienceSection = clonedResume.querySelector('[data-section="experience"]');
        if (experienceSection) {
          // Reduce spacing between experience items
          const expItems = experienceSection.querySelectorAll('[data-experience-item="true"]');
          expItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.5rem';
            
            // Reduce list spacing
            const respList = itemElem.querySelector('ul');
            if (respList) {
              const listElem = respList as HTMLElement;
              listElem.style.marginTop = '0.25rem';
              
              // Make responsibilities more compact
              const listItems = listElem.querySelectorAll('li');
              listItems.forEach(li => {
                const liElem = li as HTMLElement;
                liElem.style.fontSize = '11px';
                liElem.style.marginBottom = '0.1rem';
                liElem.style.lineHeight = '1.2';
              });
            }
          });
        }
      }

      // Replace SVG icons with text characters for better PDF compatibility
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

      // Replace bullets with text characters for better PDF compatibility
      const bulletPoints = clonedResume.querySelectorAll('[data-pdf-bullet="true"]');
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

      // Optimize bullet lists for PDF display
      const bulletLists = clonedResume.querySelectorAll('[data-pdf-bullet-list="true"]');
      bulletLists.forEach(list => {
        const listElement = list as HTMLElement;
        listElement.style.marginLeft = '0';
        listElement.style.paddingLeft = '0';
        listElement.style.listStyle = 'none';
        listElement.style.marginTop = '0.25rem';
        listElement.style.marginBottom = '0.25rem';
      });

      // Optimize bullet items for PDF display
      const bulletItems = clonedResume.querySelectorAll('.pdf-bullet-item');
      bulletItems.forEach(item => {
        const itemElement = item as HTMLElement;
        itemElement.style.display = 'flex';
        itemElement.style.alignItems = 'center';
        itemElement.style.marginBottom = '0.2rem';
        itemElement.style.lineHeight = '1.2';
      });

      // Replace section icons with text symbols for better PDF compatibility
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
      
      // Template-specific content length optimizations
      // Separate from the initial optimization to make both aspects clearer
      const optimizeContentLength = () => {
        // If this is a template with potential content overflow
        if (templateId === 'professional-navy') {
          // Find experience section which often causes overflow in professional-navy
          const experienceSection = clonedResume.querySelector('[data-section="experience"]');
          if (experienceSection) {
            const experienceItems = experienceSection.querySelectorAll('[data-experience-item="true"]');
            
            // More aggressive optimization for professional-navy with many items
            if (experienceItems.length > 2) {
              experienceItems.forEach(item => {
                const itemElem = item as HTMLElement;
                itemElem.style.marginBottom = '0.4rem';
                
                // Reduce title and company font size
                const titles = itemElem.querySelectorAll('div.font-semibold, div.text-gray-600');
                titles.forEach(title => {
                  const titleElem = title as HTMLElement;
                  titleElem.style.fontSize = '11px';
                  titleElem.style.marginBottom = '0.1rem';
                });
                
                // Make responsibility lists much more compact
                const respList = itemElem.querySelector('ul');
                if (respList) {
                  const respListElem = respList as HTMLElement;
                  respListElem.style.marginTop = '0.2rem';
                  respListElem.style.marginBottom = '0.2rem';
                  
                  // Make responsibility text smaller and tighter
                  const listItems = respListElem.querySelectorAll('li');
                  listItems.forEach(li => {
                    const liElem = li as HTMLElement;
                    liElem.style.fontSize = '10px';
                    liElem.style.marginBottom = '0.1rem';
                    liElem.style.lineHeight = '1.1';
                  });
                }
              });
            }
          }
          
          // Special handling for skill lists in professional-navy
          const skillsSection = clonedResume.querySelector('[data-section="skills"]');
          if (skillsSection) {
            const skillLists = skillsSection.querySelectorAll('.pdf-bullet-list');
            skillLists.forEach(list => {
              const listElem = list as HTMLElement;
              
              // Make skills more compact
              const skills = listElem.querySelectorAll('[data-skill-item="true"]');
              skills.forEach(skill => {
                const skillElem = skill as HTMLElement;
                skillElem.style.fontSize = '10px';
                skillElem.style.lineHeight = '1.1';
                skillElem.style.marginBottom = '0.1rem';
              });
            });
          }
        }
        
        // Special optimization for executive-clean if it has many sections
        if (templateId === 'executive-clean') {
          // Check if we have many experience items
          const experienceItems = clonedResume.querySelectorAll('[data-experience-item="true"]');
          if (experienceItems.length > 3) {
            // Reduce spacing in experience items
            experienceItems.forEach(item => {
              const itemElem = item as HTMLElement;
              itemElem.style.marginBottom = '0.4rem';
              
              // Reduce spacing in responsibilities
              const respList = itemElem.querySelector('ul');
              if (respList) {
                const respListElem = respList as HTMLElement;
                respListElem.style.marginTop = '0.2rem';
                
                // Make responsibilities more compact
                const listItems = respListElem.querySelectorAll('li');
                listItems.forEach(li => {
                  const liElem = li as HTMLElement;
                  liElem.style.fontSize = '11px';
                  liElem.style.marginBottom = '0.1rem';
                  liElem.style.lineHeight = '1.2';
                });
              }
            });
          }
        }
        
        // Special optimization for minimal-elegant
        if (templateId === 'minimal-elegant') {
          // Reduce spacing in all sections to make better use of space
          const sections = clonedResume.querySelectorAll('section');
          sections.forEach(section => {
            const sectionElem = section as HTMLElement;
            sectionElem.style.marginBottom = '0.75rem';
          });
          
          // Special handling for long skill lists
          const skillItems = clonedResume.querySelectorAll('[data-skill-item="true"]');
          if (skillItems.length > 10) {
            skillItems.forEach(skill => {
              const skillElem = skill as HTMLElement;
              skillElem.style.fontSize = '11px';
              skillElem.style.lineHeight = '1.1';
              skillElem.style.marginBottom = '0.1rem';
            });
          }
        }
      };
      
      // Apply content-specific optimizations
      optimizeContentLength();

      // Improved canvas capture settings with higher resolution and quality
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Template-specific capture settings
      const getTemplateSpecificCaptureSettings = () => {
        // Base settings for good quality
        const baseSettings = {
          scale: pixelRatio * 2.5, // Default scale factor
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
          logging: false,
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
        
        // Adjust scale factor based on template
        switch(templateId) {
          case 'professional-navy':
            // Higher resolution for professional-navy to capture details
            return {
              ...baseSettings,
              scale: pixelRatio * 3
            };
          case 'executive-clean':
            // Higher resolution for executive-clean to ensure text quality
            return {
              ...baseSettings,
              scale: pixelRatio * 2.8
            };
          default:
            return baseSettings;
        }
      };

      const captureSettings = getTemplateSpecificCaptureSettings();
      const canvas = await html2canvas(clonedResume, captureSettings);
      
      document.body.removeChild(clonedResume);

      // Define paper dimensions based on template
      // A4 dimensions in mm: 210 x 297
      // US Legal dimensions in mm: 216 x 356
      const getPaperSizeForTemplate = (templateId: string) => {
        // Use US Legal for templates with content overflow issues
        if (templateId === 'minimal-elegant' || templateId === 'executive-clean') {
          return {
            width: 216, // US Legal width in mm
            height: 356, // US Legal height in mm
            format: 'legal'
          };
        }
        
        // Use A4 for all other templates
        return {
          width: 210, // A4 width in mm
          height: 297, // A4 height in mm
          format: 'a4'
        };
      };
      
      const paperSize = getPaperSizeForTemplate(templateId);
      
      const pdf = new jsPDF({
        format: paperSize.format,
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Enhanced template-specific PDF fitting logic
      const applyTemplatePdfFitting = () => {
        // Calculate the canvas aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = paperSize.width / paperSize.height;
        
        // Template-specific PDF fitting adjustments
        switch(templateId) {
          case 'professional-navy':
            // Professional navy tends to have more vertical content
            // We need to ensure it fits within the height while maintaining proportions
            const navyHeight = paperSize.height;
            const navyWidth = navyHeight * canvasAspectRatio;
            // Center horizontally
            const navyOffsetX = (paperSize.width - navyWidth) / 2;
            
            pdf.addImage(
              imgData,
              'JPEG',
              navyOffsetX,
              0, // Align to top to ensure all content is visible
              navyWidth,
              navyHeight,
              undefined,
              'FAST'
            );
            break;
            
          case 'minimal-elegant':
          case 'executive-clean':
            // For US Legal format, use full width and maintain aspect ratio
            // This gives more vertical space to fit content
            const imgWidth = paperSize.width;
            const imgHeight = imgWidth / canvasAspectRatio;
            
            pdf.addImage(
              imgData,
              'JPEG',
              0, // No horizontal offset - use full width
              0, // No vertical offset
              imgWidth,
              imgHeight,
              undefined,
              'FAST'
            );
            break;
            
          default:
            // Standard approach for other templates
            // Choose fitting strategy based on aspect ratio comparison
            if (canvasAspectRatio < pageAspectRatio) {
              // Content is taller than page proportions
              const imgHeight = paperSize.height;
              const imgWidth = imgHeight * canvasAspectRatio;
              const offsetX = (paperSize.width - imgWidth) / 2; // Center horizontally
              
              pdf.addImage(
                imgData,
                'JPEG',
                offsetX,
                0, // Align to top
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
              );
            } else {
              // Content fits within page proportions or is wider
              const imgWidth = paperSize.width;
              const imgHeight = imgWidth / canvasAspectRatio;
              
              pdf.addImage(
                imgData,
                'JPEG',
                0, // No horizontal offset - use full width
                0, // No vertical offset
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
              );
            }
        }
      };
      
      // Apply template-specific PDF fitting
      applyTemplatePdfFitting();

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

