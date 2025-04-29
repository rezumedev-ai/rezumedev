
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
            // IMPROVED: More aggressive optimization to prevent content cutoff
            const execCleanContent = clonedResume.querySelectorAll('[data-section]');
            execCleanContent.forEach(section => {
              const sectionElement = section as HTMLElement;
              sectionElement.style.marginBottom = '0.5rem';
              sectionElement.style.paddingBottom = '0';
            });
            
            // Reduce spacing in experience sections
            const execExperienceItems = clonedResume.querySelectorAll('[data-experience-item="true"]');
            execExperienceItems.forEach(item => {
              const itemEl = item as HTMLElement;
              itemEl.style.marginBottom = '0.5rem';
              
              // Make responsibility lists more compact
              const respList = itemEl.querySelector('ul');
              if (respList) {
                const listEl = respList as HTMLElement;
                listEl.style.marginTop = '0.2rem';
                listEl.style.marginBottom = '0.2rem';
              }
            });
            
            // Reduce font size of all text elements
            const execAllTexts = clonedResume.querySelectorAll('p, li, div[contenteditable="true"]');
            execAllTexts.forEach(text => {
              const textEl = text as HTMLElement;
              // Reduce font size by 8% to fit more content
              if (textEl.style.fontSize) {
                const currentSize = parseFloat(textEl.style.fontSize);
                textEl.style.fontSize = `${currentSize * 0.92}px`;
              }
              // Tighten line height
              textEl.style.lineHeight = '1.2';
            });
            
            // Set height to prioritize content display
            clonedResume.style.height = `${originalHeight}px`;
            break;
            
          case 'minimal-elegant':
            // IMPROVED: More aggressive optimization to prevent content cutoff
            const minElegantContent = clonedResume.querySelectorAll('[data-section]');
            minElegantContent.forEach(section => {
              const sectionElement = section as HTMLElement;
              sectionElement.style.marginBottom = '0.5rem';
              sectionElement.style.paddingBottom = '0';
            });
            
            // Reduce spacing in lists
            const minElegantLists = clonedResume.querySelectorAll('ul, ol');
            minElegantLists.forEach(list => {
              const listEl = list as HTMLElement;
              listEl.style.marginTop = '0.2rem';
              listEl.style.marginBottom = '0.2rem';
              
              // Make list items more compact
              const items = listEl.querySelectorAll('li');
              items.forEach(item => {
                const itemEl = item as HTMLElement;
                itemEl.style.fontSize = '11px';
                itemEl.style.marginBottom = '0.1rem';
                itemEl.style.lineHeight = '1.2';
              });
            });
            
            // Reduce sections spacing
            const minElegantSections = clonedResume.querySelectorAll('section, div[class*="space-y"], div[class*="mb-"]');
            minElegantSections.forEach(section => {
              const sectionEl = section as HTMLElement;
              sectionEl.style.marginBottom = '0.5rem';
              if (sectionEl.style.paddingBottom) {
                sectionEl.style.paddingBottom = '0';
              }
            });
            
            // Reduce font size of all text elements
            const allTextElements = clonedResume.querySelectorAll('p, li, span, div:not([class*="grid"])');
            allTextElements.forEach(element => {
              const el = element as HTMLElement;
              if (el.style.fontSize) {
                // If font size is specified, reduce it by 8%
                const currentSize = parseFloat(el.style.fontSize);
                el.style.fontSize = `${currentSize * 0.92}px`;
              }
              // Tighten line height
              el.style.lineHeight = '1.2';
            });
            
            // Set height to prioritize content display
            clonedResume.style.height = `${originalHeight}px`;
            break;
            
          case 'professional-navy':
            // The professional-navy template needs special handling for content overflow
            // Reduce font size of all text to fit more content
            const navyTextElements = clonedResume.querySelectorAll('p, li, span, div:not([class*="grid"])');
            navyTextElements.forEach(element => {
              const el = element as HTMLElement;
              if (el.style.fontSize) {
                // If font size is specified, reduce it by 5%
                const currentSize = parseFloat(el.style.fontSize);
                el.style.fontSize = `${currentSize * 0.95}px`;
              }
            });
            
            // Compress spacing between sections to fit more content
            const navySections = clonedResume.querySelectorAll('section, div[class*="space-y"], div[class*="mb-"]');
            navySections.forEach(section => {
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
            const navyLists = clonedResume.querySelectorAll('ul, ol');
            navyLists.forEach(list => {
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
        // IMPROVED: More aggressive optimization for sections that cause cutoff
        const skillsSection = clonedResume.querySelector('[data-section="skills"]');
        const certSection = clonedResume.querySelector('[data-section="certifications"]');
        const summarySection = clonedResume.querySelector('[data-section="summary"]');
        const educationSection = clonedResume.querySelector('[data-section="education"]');
        const experienceSection = clonedResume.querySelector('[data-section="experience"]');
        
        // Adjust skills section font sizes and spacing
        if (skillsSection) {
          const skillHeadings = skillsSection.querySelectorAll('h4');
          skillHeadings.forEach(heading => {
            const headingElem = heading as HTMLElement;
            headingElem.style.fontSize = '13px';
            headingElem.style.marginBottom = '0.2rem';
          });
          
          const skillLists = skillsSection.querySelectorAll('.pdf-bullet-list');
          skillLists.forEach(list => {
            const listElem = list as HTMLElement;
            listElem.style.marginTop = '0.2rem';
            
            const items = listElem.querySelectorAll('li');
            items.forEach(item => {
              const itemElem = item as HTMLElement;
              itemElem.style.fontSize = '11px';
              itemElem.style.lineHeight = '1.1';
              itemElem.style.marginBottom = '0.1rem';
            });
          });
        }
        
        // Optimize certifications display - significant improvements
        if (certSection) {
          const certItems = certSection.querySelectorAll('li');
          certItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.1rem';
            
            const textElements = itemElem.querySelectorAll('div');
            textElements.forEach(div => {
              const divElem = div as HTMLElement;
              divElem.style.fontSize = '11px';
              divElem.style.lineHeight = '1.1';
            });
          });
        }
        
        // Optimize professional summary - reduced size
        if (summarySection) {
          const summaryText = summarySection.querySelector('div[contenteditable]') || summarySection.querySelector('p');
          if (summaryText) {
            const textElem = summaryText as HTMLElement;
            textElem.style.fontSize = '11px';
            textElem.style.lineHeight = '1.2';
            textElem.style.marginBottom = '0.4rem';
          }
        }
        
        // Education section optimizations - more compact
        if (educationSection) {
          const eduItems = educationSection.querySelectorAll('div[data-edu-item="true"]');
          eduItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.2rem';
            itemElem.style.paddingBottom = '0.1rem';
            
            const titleElem = itemElem.querySelector('.font-semibold');
            if (titleElem) {
              (titleElem as HTMLElement).style.fontSize = '12px';
            }
            
            const schoolElem = itemElem.querySelector('.text-gray-700');
            if (schoolElem) {
              (schoolElem as HTMLElement).style.fontSize = '11px';
            }
            
            const dateElements = itemElem.querySelectorAll('.text-gray-500, .text-emerald-600, .text-[#0F2B5B]');
            dateElements.forEach(date => {
              (date as HTMLElement).style.fontSize = '10px';
            });
          });
        }
        
        // IMPROVED: More aggressive optimization for experience section
        if (experienceSection) {
          const expItems = experienceSection.querySelectorAll('[data-experience-item="true"]');
          expItems.forEach(item => {
            const itemElem = item as HTMLElement;
            itemElem.style.marginBottom = '0.3rem';
            itemElem.style.paddingBottom = '0.2rem';
            
            // Make job title and company more compact
            const jobElem = itemElem.querySelector('.font-semibold');
            if (jobElem) {
              (jobElem as HTMLElement).style.fontSize = '12px';
              (jobElem as HTMLElement).style.marginBottom = '0.1rem';
            }
            
            const companyElem = itemElem.querySelector('.text-gray-700, .text-gray-600');
            if (companyElem) {
              (companyElem as HTMLElement).style.fontSize = '11px';
            }
            
            const dateElements = itemElem.querySelectorAll('.text-gray-500, .text-emerald-600, .text-[#0F2B5B]');
            dateElements.forEach(date => {
              (date as HTMLElement).style.fontSize = '10px';
            });
            
            // Make responsibility lists very compact
            const respList = itemElem.querySelector('ul');
            if (respList) {
              const listElem = respList as HTMLElement;
              listElem.style.marginTop = '0.15rem';
              listElem.style.marginBottom = '0.15rem';
              
              // Make responsibilities more compact
              const listItems = listElem.querySelectorAll('li');
              listItems.forEach(li => {
                const liElem = li as HTMLElement;
                liElem.style.fontSize = '10px';
                liElem.style.marginBottom = '0.05rem';
                liElem.style.lineHeight = '1.1';
                liElem.style.paddingBottom = '0';
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
        if (['minimal-elegant', 'executive-clean', 'professional-navy'].includes(templateId)) {
          // IMPROVED: More aggressive optimization for content-heavy templates
          
          // Measure the actual content height to determine if scaling is needed
          const contentHeight = clonedResume.scrollHeight;
          const availableHeight = 1056; // A4 height in pixels at 96 DPI
          const contentOverflow = contentHeight > availableHeight;
          
          if (contentOverflow) {
            console.log(`Content overflow detected for ${templateId}: ${contentHeight}px > ${availableHeight}px`);
            
            // For templates with single column layout, apply more aggressive optimizations
            if (templateId === 'minimal-elegant' || templateId === 'executive-clean') {
              // Global font size reduction across all elements
              const allElements = clonedResume.querySelectorAll('*');
              allElements.forEach(elem => {
                const el = elem as HTMLElement;
                if (el.style && el.style.fontSize) {
                  const currentSize = parseFloat(el.style.fontSize);
                  // More aggressive scaling for minimal-elegant
                  if (templateId === 'minimal-elegant') {
                    el.style.fontSize = `${currentSize * 0.85}px`;
                  } else {
                    el.style.fontSize = `${currentSize * 0.9}px`;
                  }
                }
                
                // Reduce line heights globally
                if (el.style) {
                  el.style.lineHeight = '1.1';
                  
                  // Reduce margins and paddings
                  if (el.style.marginBottom) {
                    const currentMargin = parseFloat(el.style.marginBottom);
                    el.style.marginBottom = `${currentMargin * 0.7}px`;
                  }
                  
                  if (el.style.paddingBottom) {
                    const currentPadding = parseFloat(el.style.paddingBottom);
                    el.style.paddingBottom = `${currentPadding * 0.7}px`;
                  }
                }
              });
              
              // Experience section extreme optimization
              const expItems = clonedResume.querySelectorAll('[data-experience-item="true"]');
              if (expItems.length > 2) {
                expItems.forEach(item => {
                  const itemElem = item as HTMLElement;
                  itemElem.style.marginBottom = '0.2rem';
                  itemElem.style.paddingBottom = '0.1rem';
                  
                  // Make responsibility lists extremely compact
                  const respList = itemElem.querySelector('ul');
                  if (respList) {
                    const listElem = respList as HTMLElement;
                    listElem.style.marginTop = '0.1rem';
                    listElem.style.marginBottom = '0.1rem';
                    
                    // Extreme minimization of list items
                    const listItems = listElem.querySelectorAll('li');
                    listItems.forEach(li => {
                      const liElem = li as HTMLElement;
                      liElem.style.fontSize = '9.5px';
                      liElem.style.marginBottom = '0.05rem';
                      liElem.style.lineHeight = '1.05';
                      liElem.style.paddingBottom = '0';
                    });
                  }
                });
              }
              
              // Education section extreme optimization
              const eduItems = clonedResume.querySelectorAll('[data-edu-item="true"]');
              if (eduItems.length > 1) {
                eduItems.forEach(item => {
                  const itemElem = item as HTMLElement;
                  itemElem.style.marginBottom = '0.15rem';
                  itemElem.style.paddingBottom = '0.1rem';
                });
              }
            }
            
            // Special handling for professional-navy
            if (templateId === 'professional-navy') {
              // Force smaller font sizes for all elements
              const allNavyElements = clonedResume.querySelectorAll('*');
              allNavyElements.forEach(elem => {
                const el = elem as HTMLElement;
                if (el.style && el.style.fontSize) {
                  const currentSize = parseFloat(el.style.fontSize);
                  el.style.fontSize = `${currentSize * 0.85}px`;
                }
              });
              
              // Ultra-compact experience items
              const expItems = clonedResume.querySelectorAll('[data-experience-item="true"]');
              expItems.forEach(item => {
                const itemElem = item as HTMLElement;
                itemElem.style.marginBottom = '0.2rem';
                
                // Make responsibility lists extremely compact
                const respList = itemElem.querySelector('ul');
                if (respList) {
                  const listElem = respList as HTMLElement;
                  listElem.style.marginTop = '0.1rem';
                  
                  // Extreme minimization of list items
                  const listItems = listElem.querySelectorAll('li');
                  listItems.forEach(li => {
                    const liElem = li as HTMLElement;
                    liElem.style.fontSize = '9px';
                    liElem.style.marginBottom = '0.05rem';
                    liElem.style.lineHeight = '1';
                  });
                }
              });
            }
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
          case 'minimal-elegant':
            // IMPROVED: Higher resolution for content-heavy templates to ensure text quality
            return {
              ...baseSettings,
              scale: pixelRatio * 3.2
            };
          default:
            return baseSettings;
        }
      };

      const captureSettings = getTemplateSpecificCaptureSettings();
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
      
      // IMPROVED: Enhanced template-specific PDF fitting logic
      const applyTemplatePdfFitting = () => {
        // Calculate the canvas aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const a4AspectRatio = pdfWidth / pdfHeight;
        
        // Template-specific PDF fitting adjustments
        switch(templateId) {
          case 'professional-navy':
            // Professional navy tends to have more vertical content
            // We need to ensure it fits within the height while maintaining proportions
            const navyHeight = pdfHeight;
            const navyWidth = navyHeight * canvasAspectRatio;
            // Center horizontally
            const navyOffsetX = (pdfWidth - navyWidth) / 2;
            
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
            // IMPROVED: For these templates prioritize content visibility
            // We want to scale to fit all content in height while maintaining proportions
            
            // Use height scaling to ensure all content is visible
            // Calculate scaled dimensions that preserve aspect ratio
            const imgHeight = pdfHeight;
            const imgWidth = imgHeight * canvasAspectRatio;
            
            // If width exceeds page width after height scaling, use width scaling instead
            if (imgWidth > pdfWidth) {
              const widthScaledHeight = pdfWidth / canvasAspectRatio;
              
              pdf.addImage(
                imgData,
                'JPEG',
                0, // No horizontal offset - use full width
                0, // No vertical offset
                pdfWidth,
                widthScaledHeight,
                undefined,
                'FAST'
              );
            } else {
              // Center horizontally if there's extra space
              const offsetX = (pdfWidth - imgWidth) / 2;
              
              pdf.addImage(
                imgData,
                'JPEG',
                offsetX,
                0, // Align to top to ensure all content is visible
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
              );
            }
            break;
            
          default:
            // Standard approach for other templates - prioritize height
            // This ensures content isn't cut off at the bottom
            if (canvasAspectRatio < a4AspectRatio) {
              // Content is taller than A4 proportions - prioritize height
              const imgHeight = pdfHeight;
              const imgWidth = imgHeight * canvasAspectRatio;
              const offsetX = (pdfWidth - imgWidth) / 2; // Center horizontally
              
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
              // Content fits within A4 proportions or is wider
              // Prioritize width and accept potential vertical overflow
              const imgWidth = pdfWidth;
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
