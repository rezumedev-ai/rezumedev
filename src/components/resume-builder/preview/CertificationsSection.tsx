
import { Certification } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { useMemo } from "react";

interface CertificationsSectionProps {
  certifications: Certification[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof Certification, value: string) => void;
}

export function CertificationsSection({ 
  certifications, 
  template,
  isEditing,
  onUpdate 
}: CertificationsSectionProps) {
  // Return null if the certifications array is empty or undefined
  if (!certifications || certifications.length === 0) {
    return null;
  }

  const handleContentEdit = (
    index: number,
    field: keyof Certification,
    event: React.FocusEvent<HTMLElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  // Calculate dynamic font sizes based on content length
  const dynamicFontSizes = useMemo(() => {
    const totalItems = certifications.length;
    
    // Base font size adjustments
    let nameFontSize = "text-base";
    let orgFontSize = "text-base";
    let dateFontSize = "text-[14px]";
    
    // Adjust font sizes based on number of items
    if (totalItems > 5) {
      nameFontSize = "text-[15px]";
      orgFontSize = "text-[15px]";
      dateFontSize = "text-[13px]";
    } else if (totalItems <= 2) {
      nameFontSize = "text-base";
      orgFontSize = "text-[15px]";
      dateFontSize = "text-[14px]";
    }
    
    // Adjust for very long name/organization text
    const hasLongNames = certifications.some(cert => cert.name.length > 30);
    const hasLongOrgs = certifications.some(cert => cert.organization.length > 30);
    
    if (hasLongNames) {
      nameFontSize = totalItems > 3 ? "text-[15px]" : "text-base";
    }
    
    if (hasLongOrgs) {
      orgFontSize = totalItems > 3 ? "text-[14px]" : "text-[15px]";
    }
    
    return { nameFontSize, orgFontSize, dateFontSize };
  }, [certifications]);

  // Template-specific styles
  const styles = {
    "executive-clean": {
      section: "mb-5",
      title: "text-[20px] font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-300",
      name: `font-bold ${dynamicFontSizes.nameFontSize} text-gray-800`,
      organization: `${dynamicFontSizes.orgFontSize} text-gray-700`,
      date: `${dynamicFontSizes.dateFontSize} text-gray-500`
    },
    "modern-split": {
      section: "mb-4",
      title: "text-[14px] font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center",
      name: `font-semibold text-[13px] text-gray-800`,
      organization: `text-[12px] text-gray-600`,
      date: `text-[11px] text-gray-500`
    },
    "minimal-elegant": {
      section: "mb-7",
      title: "text-[14px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium flex items-center gap-1.5 after:content-[''] after:h-px after:flex-grow after:bg-gray-200",
      name: `font-normal ${dynamicFontSizes.nameFontSize} text-gray-700`,
      organization: `${dynamicFontSizes.orgFontSize} text-gray-500 italic`,
      date: `${dynamicFontSizes.dateFontSize} text-gray-400`
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-[18px] font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      name: `font-medium ${dynamicFontSizes.nameFontSize}`,
      organization: `${dynamicFontSizes.orgFontSize} text-gray-600`,
      date: `${dynamicFontSizes.dateFontSize} text-gray-500`
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1"></span>
            Certificates
          </span>
        ) : template.id === "professional-executive" ? (
          "Certificates"
        ) : template.id === "minimal-elegant" ? (
          <span>Certificates</span>
        ) : (
          "Certificates"
        )}
      </h3>
      <div className={template.id === "minimal-elegant" ? "space-y-3" : template.id === "modern-split" ? "space-y-1.5" : "space-y-2"}>
        {certifications.map((cert, index) => (
          template.id === "minimal-elegant" ? (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-baseline">
                <span 
                  className={`${currentStyle.name} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "name", e)}
                >
                  {cert.name}
                </span>
                <span 
                  className={`${currentStyle.date} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "completionDate", e)}
                >
                  {cert.completionDate}
                </span>
              </div>
              <span 
                className={`${currentStyle.organization} outline-none block mt-0.5`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "organization", e)}
              >
                {cert.organization}
              </span>
            </div>
          ) : (
            <div key={index} className="flex justify-between items-baseline gap-2">
              <div>
                <span 
                  className={`${currentStyle.name} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "name", e)}
                >
                  {cert.name}
                </span>
                {template.id !== "professional-executive" && template.id !== "modern-split" && <span className="text-gray-500 mx-1">•</span>}
                {template.id !== "modern-split" && (
                  <span 
                    className={`${currentStyle.organization} outline-none`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "organization", e)}
                  >
                    {cert.organization}
                  </span>
                )}
              </div>
              <span 
                className={`${currentStyle.date} outline-none whitespace-nowrap`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "completionDate", e)}
              >
                {cert.completionDate}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
