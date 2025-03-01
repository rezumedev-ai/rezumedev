
import { WorkExperience } from "@/types/resume";
import { formatDate, cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resumeTemplates } from "./templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (templateId === "modern-split") {
      return {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      };
    }
    return {
      top: '1in',
      right: '1in',
      bottom: '1in',
      left: '1in',
    };
  };

  const margins = getMargins();

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
          className="bg-white shadow-xl"
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
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: margins.top,
              right: margins.right,
              bottom: margins.bottom,
              left: margins.left,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <div className={selectedTemplate.style.headerStyle}>
              <h1 className={selectedTemplate.style.titleFont}>
                {personalInfo.fullName}
              </h1>
              <h2 className={templateId === "modern-split" ? "text-base text-gray-600 mt-1" : "text-xl text-gray-600 mt-2"}>
                {professionalSummary.title}
              </h2>
              <div className={templateId === "modern-split" ? 
                "flex flex-wrap gap-3 text-sm text-gray-500 mt-1" : 
                "flex flex-wrap gap-4 text-sm text-gray-500 mt-2"}>
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              </div>
            </div>

            <div 
              className={cn(selectedTemplate.style.contentStyle, "overflow-hidden")}
              style={{
                height: templateId === "modern-split" ? 'calc(100% - 110px)' : 'calc(100% - 120px)',
              }}
            >
              <div>
                <h3 className={selectedTemplate.style.sectionStyle}>Professional Summary</h3>
                <p className={templateId === "modern-split" ? "text-xs text-gray-700 mt-1" : "text-gray-700 mt-2"}>{professionalSummary.summary}</p>
              </div>

              {workExperience.length > 0 && (
                <div className="mt-6">
                  <h3 className={selectedTemplate.style.sectionStyle}>Work Experience</h3>
                  <div className="space-y-4 mt-2">
                    {workExperience.map((exp, index) => (
                      <div key={index}>
                        <h4 className="font-medium">{exp.jobTitle}</h4>
                        <div className="text-gray-600">{exp.companyName}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                        </div>
                        <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div className="mt-6">
                  <h3 className={selectedTemplate.style.sectionStyle}>Education</h3>
                  <div className="space-y-4 mt-2">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <h4 className="font-medium">{edu.schoolName}</h4>
                        <div className="text-gray-600">{edu.degreeName}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
                <div className="mt-6">
                  <h3 className={selectedTemplate.style.sectionStyle}>Skills</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {skills.hard_skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Technical Skills</h4>
                        <div className="text-gray-600">
                          {skills.hard_skills.join(", ")}
                        </div>
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Soft Skills</h4>
                        <div className="text-gray-600">
                          {skills.soft_skills.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className={selectedTemplate.style.sectionStyle}>Certifications</h3>
                  <div className="space-y-4 mt-2">
                    {certifications.map((cert, index) => (
                      <div key={index}>
                        <h4 className="font-medium">{cert.name}</h4>
                        <div className="text-gray-600">{cert.organization}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(cert.completionDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
