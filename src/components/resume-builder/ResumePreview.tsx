
import { WorkExperience } from "@/types/resume";
import { formatDate, cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resumeTemplates } from "./templates";
import { ResumeContent } from "./ResumeContent";

interface ResumePreviewProps {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  professionalSummary: {
    title: string;
    summary: string;
  };
  workExperience?: WorkExperience[];
  education?: {
    degreeName: string;
    schoolName: string;
    startDate: string;
    endDate: string;
    isCurrentlyEnrolled?: boolean;
  }[];
  skills?: {
    hard_skills: string[];
    soft_skills: string[];
  };
  certifications?: {
    name: string;
    organization: string;
    completionDate: string;
  }[];
  templateId?: string;
  isEditable?: boolean;
  onUpdate?: (section: string, value: any) => void;
}

export function ResumePreview({
  personalInfo,
  professionalSummary,
  workExperience = [],
  education = [],
  skills = { hard_skills: [], soft_skills: [] },
  certifications = [],
  templateId = "minimal-clean",
  isEditable = false,
  onUpdate
}: ResumePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const DPI = 96; // Standard screen DPI
  const WIDTH_INCHES = 8.5;
  const HEIGHT_INCHES = 11;
  const WIDTH_PX = Math.floor(WIDTH_INCHES * DPI); // 816px
  const HEIGHT_PX = Math.floor(HEIGHT_INCHES * DPI); // 1056px

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !resumeRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth - 48; // Account for padding
      const containerHeight = container.clientHeight - 48;

      const scaleX = containerWidth / WIDTH_PX;
      const scaleY = containerHeight / HEIGHT_PX;
      let newScale = Math.min(scaleX, scaleY, 1);

      if (isMobile) {
        newScale = isZoomed ? 0.8 : 0.4;
      } else {
        newScale = Math.min(newScale, 0.85);
      }

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

  const getMargins = () => {
    return selectedTemplate.style.spacing.margins;
  };

  const margins = getMargins();

  // Compute dynamic font sizes based on template and content length
  const getFontSize = (baseSize: string, contentLength: number, threshold: number) => {
    if (templateId === "modern-split") {
      // For modern-split template, adjust font sizes based on content length
      if (contentLength > threshold) {
        if (baseSize.includes("text-base")) return "text-sm";
        if (baseSize.includes("text-sm")) return "text-xs";
        if (baseSize.includes("text-xs")) return "text-[10px]";
        return baseSize;
      }
    }
    return baseSize;
  };

  // Dynamic calculation for summary text size
  const summaryTextSize = getFontSize(
    templateId === "modern-split" ? "text-[11px]" : "text-gray-700 mt-2",
    professionalSummary.summary.length,
    200
  );

  return (
    <div className="relative w-full h-screen flex flex-col items-center bg-gray-100">
      {isMobile && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleZoom}
          className="absolute top-4 right-4 z-10"
        >
          {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
        </Button>
      )}

      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center p-6 overflow-hidden"
      >
        <div
          ref={resumeRef}
          id="resume-content"
          className="bg-white shadow-xl will-change-transform"
          data-template-id={templateId}
          style={{
            width: `${WIDTH_PX}px`,
            height: `${HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            margin: '0',
            padding: '0',
            position: 'absolute',
            boxSizing: 'border-box',
            overflow: 'hidden',
            minWidth: `${WIDTH_PX}px`,
            maxWidth: `${WIDTH_PX}px`,
            minHeight: `${HEIGHT_PX}px`,
            maxHeight: `${HEIGHT_PX}px`,
            fontFeatureSettings: '"kern" 1, "liga" 1',
            fontSmooth: 'always',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            backgroundColor: 'white',
            // Apply padding from template style
            paddingTop: selectedTemplate.style.spacing.margins.top,
            paddingRight: selectedTemplate.style.spacing.margins.right,
            paddingBottom: selectedTemplate.style.spacing.margins.bottom,
            paddingLeft: selectedTemplate.style.spacing.margins.left,
          }}
        >
          <ResumeContent
            resumeState={{
              personal_info: {
                fullName: personalInfo.fullName,
                email: personalInfo.email,
                phone: personalInfo.phone,
                linkedin: personalInfo.linkedin,
                website: personalInfo.website,
                // Add profile image if available in props (it wasn't in original props but ResumeContent expects it)
                // We'll need to check if we can pass it or default to empty
              },
              professional_summary: professionalSummary,
              work_experience: workExperience,
              education: education,
              skills: skills,
              certifications: certifications,
              template_id: templateId
            }}
            template={selectedTemplate}
            isEditing={isEditable}
            resumeId="preview" // Placeholder ID as this is builder preview
            onPersonalInfoUpdate={(field, value) => onUpdate?.("personal_info", { [field]: value })}
            onProfileImageUpdate={() => { }} // No-op for now in builder preview
            onSummaryUpdate={(value) => onUpdate?.("professional_summary", { summary: value })}
            onSkillsUpdate={(type, value) => onUpdate?.("skills", { [type === 'hard' ? 'hard_skills' : 'soft_skills']: value })}
            onEducationUpdate={() => { }} // Complex updates handled by parent form
            onCertificationUpdate={() => { }} // Complex updates handled by parent form
            onExperienceUpdate={() => { }} // Complex updates handled by parent form
          />
        </div>
      </div>
    </div>
  );
}
