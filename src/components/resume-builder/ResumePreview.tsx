import { WorkExperience } from "@/types/resume";
import { formatDate, cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resumeTemplates } from "./templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut, File, Briefcase, GraduationCap, Award, Lightbulb } from "lucide-react";
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
      let newScale;

      if (isMobile) {
        newScale = isZoomed ? 0.9 : 0.65;
      } else {
        const scaleY = containerHeight / HEIGHT_PX;
        newScale = Math.min(scaleX, scaleY, 1);
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

  const getFontSize = (baseSize: string, contentLength: number, threshold: number) => {
    if (templateId === "modern-split") {
      if (contentLength > threshold) {
        if (baseSize.includes("text-base")) return "text-sm";
        if (baseSize.includes("text-sm")) return "text-xs";
        if (baseSize.includes("text-xs")) return "text-[10px]";
        return baseSize;
      }
    }
    return baseSize;
  };

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
        className="w-full h-full flex items-center justify-center p-6 overflow-auto"
      >
        <div 
          ref={resumeRef}
          id="resume-content"
          className="bg-white shadow-xl"
          style={{
            width: `${WIDTH_PX}px`,
            height: `${HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: isMobile ? 'top center' : 'center',
            margin: isMobile ? '0 auto 100px' : '0',
            padding: '0',
            position: 'absolute',
            top: isMobile ? '80px' : '50%',
            left: '50%',
            transform: isMobile 
              ? `translateX(-50%) scale(${scale})` 
              : `translate(-50%, -50%) scale(${scale})`,
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
              <h2 className={templateId === "modern-split" ? "text-sm text-gray-700 mt-1 font-medium" : "text-xl text-gray-600 mt-2"}>
                {professionalSummary.title}
              </h2>
              <div className={templateId === "modern-split" ? 
                "flex flex-wrap gap-2 text-xs text-gray-600 mt-1" : 
                "flex flex-wrap gap-4 text-sm text-gray-500 mt-2"}>
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              </div>
            </div>

            <div 
              className={cn(selectedTemplate.style.contentStyle, "overflow-hidden")}
              style={{
                height: 'calc(100% - 80px)',
              }}
            >
              <div>
                <h3 className={selectedTemplate.style.sectionStyle}>
                  {templateId === "modern-split" ? (
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
                      Professional Summary
                    </span>
                  ) : (
                    "Professional Summary"
                  )}
                </h3>
                <p className={templateId === "modern-split" ? `${summaryTextSize} text-gray-700 mt-1 leading-tight` : "text-gray-700 mt-2"}>
                  {professionalSummary.summary}
                </p>
              </div>

              {workExperience.length > 0 && (
                <div className={templateId === "modern-split" ? "mt-3" : "mt-6"}>
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    {templateId === "modern-split" ? (
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
                        Work Experience
                      </span>
                    ) : (
                      "Work Experience"
                    )}
                  </h3>
                  <div className={templateId === "modern-split" ? "space-y-2 mt-1" : "space-y-4 mt-2"}>
                    {workExperience.map((exp, index) => (
                      <div key={index} className={templateId === "modern-split" ? "relative pl-3 border-l border-gray-200" : ""}>
                        {templateId === "modern-split" && (
                          <div className="absolute top-1 left-[-2px] w-1 h-1 rounded-full bg-gray-400"></div>
                        )}
                        <div className={templateId === "modern-split" ? "mb-0" : ""}>
                          <div className="flex justify-between items-baseline">
                            <h4 className={templateId === "modern-split" ? "font-semibold text-xs" : "font-medium"}>
                              {exp.jobTitle}
                            </h4>
                            <div className={templateId === "modern-split" ? "text-[10px] text-gray-500" : "text-sm text-gray-500"}>
                              {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                            </div>
                          </div>
                          <div className={templateId === "modern-split" ? "text-[10px] text-gray-600" : "text-gray-600"}>
                            {exp.companyName}
                          </div>
                          <ul className={templateId === "modern-split" ? 
                            "mt-1 space-y-0.5 text-[10px] text-gray-700" : 
                            "list-disc ml-4 mt-2 text-gray-600 space-y-1"}>
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className={templateId === "modern-split" ? "flex items-start gap-1 leading-tight" : ""}>
                                {templateId === "modern-split" && (
                                  <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                                )}
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div className={templateId === "modern-split" ? "mt-3" : "mt-6"}>
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    {templateId === "modern-split" ? (
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
                        Education
                      </span>
                    ) : (
                      "Education"
                    )}
                  </h3>
                  <div className={templateId === "modern-split" ? "space-y-1.5 mt-1" : "space-y-4 mt-2"}>
                    {education.map((edu, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline">
                          <h4 className={templateId === "modern-split" ? "font-semibold text-xs" : "font-medium"}>
                            {edu.degreeName}
                          </h4>
                          <div className={templateId === "modern-split" ? "text-[10px] text-gray-500" : "text-sm text-gray-500"}>
                            {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                          </div>
                        </div>
                        <div className={templateId === "modern-split" ? "text-[10px] text-gray-600" : "text-gray-600"}>
                          {edu.schoolName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
                <div className={templateId === "modern-split" ? "mt-3" : "mt-6"}>
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    {templateId === "modern-split" ? (
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
                        Skills
                      </span>
                    ) : (
                      "Skills"
                    )}
                  </h3>
                  <div className={templateId === "modern-split" ? 
                    "grid grid-cols-2 gap-2 mt-1" : 
                    "grid grid-cols-2 gap-4 mt-2"}>
                    {skills.hard_skills.length > 0 && (
                      <div>
                        <h4 className={templateId === "modern-split" ? "font-semibold text-[10px] mb-1" : "font-medium mb-2"}>
                          Technical Skills
                        </h4>
                        <div className={templateId === "modern-split" ? "text-[10px] text-gray-600 leading-tight" : "text-gray-600"}>
                          {skills.hard_skills.join(", ")}
                        </div>
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div>
                        <h4 className={templateId === "modern-split" ? "font-semibold text-[10px] mb-1" : "font-medium mb-2"}>
                          Soft Skills
                        </h4>
                        <div className={templateId === "modern-split" ? "text-[10px] text-gray-600 leading-tight" : "text-gray-600"}>
                          {skills.soft_skills.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div className={templateId === "modern-split" ? "mt-3" : "mt-6"}>
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    {templateId === "modern-split" ? (
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
                        Certifications
                      </span>
                    ) : (
                      "Certifications"
                    )}
                  </h3>
                  <div className={templateId === "modern-split" ? "space-y-1 mt-1" : "space-y-4 mt-2"}>
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-baseline">
                        <div>
                          <span className={templateId === "modern-split" ? "font-semibold text-[10px]" : "font-medium"}>
                            {cert.name}
                          </span>
                          {templateId !== "modern-split" && <span className="text-gray-500 mx-1">•</span>}
                          <span className={templateId === "modern-split" ? "text-[10px] text-gray-600" : "text-gray-600"}>
                            {cert.organization}
                          </span>
                        </div>
                        <div className={templateId === "modern-split" ? "text-[10px] text-gray-500" : "text-sm text-gray-500"}>
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
