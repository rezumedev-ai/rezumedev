
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
  workExperience,
  education,
  skills,
  certifications,
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

  // Constants for A4 dimensions in pixels (at 96 DPI)
  const A4_WIDTH_PX = 794; // 210mm at 96 DPI
  const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI
  const MARGIN_MM = 20; // 20mm margins

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate scales based on available space
        const scaleX = (containerWidth - 48) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 48) / A4_HEIGHT_PX;
        
        // Use the smaller scale to maintain aspect ratio
        let newScale = Math.min(scaleX, scaleY);
        
        // Adjust scale based on device and zoom state
        if (isMobile) {
          newScale = isZoomed ? 0.8 : 0.4;
        } else {
          newScale = Math.min(newScale, 0.8);
        }
        
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  const { style } = template;

  const handleEdit = (section: string, field: string, value: any) => {
    if (!onUpdate) return;

    if (section === 'personalInfo') {
      onUpdate('personal_info', {
        ...personalInfo,
        [field]: value
      });
    } else if (section === 'professionalSummary') {
      onUpdate('professional_summary', {
        ...professionalSummary,
        [field]: value
      });
    }
    setEditingField(null);
  };

  const EditableText = ({ text, section, field }: { text: string; section: string; field: string }) => {
    const isEditing = editingField === `${section}.${field}`;
    
    if (!isEditable) return <span>{text}</span>;

    if (isEditing) {
      return (
        <Input
          value={text}
          onChange={(e) => handleEdit(section, field, e.target.value)}
          onBlur={() => setEditingField(null)}
          autoFocus
          className="min-w-[200px]"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingField(`${section}.${field}`)}
        className="cursor-pointer hover:bg-gray-100 px-1 rounded"
      >
        {text}
      </span>
    );
  };

  const EditableTextArea = ({ text, section, field }: { text: string; section: string; field: string }) => {
    const isEditing = editingField === `${section}.${field}`;
    
    if (!isEditable) return <p className="text-gray-700">{text}</p>;

    if (isEditing) {
      return (
        <Textarea
          value={text}
          onChange={(e) => handleEdit(section, field, e.target.value)}
          onBlur={() => setEditingField(null)}
          autoFocus
          className="min-h-[100px]"
        />
      );
    }

    return (
      <p
        onClick={() => setEditingField(`${section}.${field}`)}
        className="cursor-pointer hover:bg-gray-100 px-1 rounded text-gray-700"
      >
        {text}
      </p>
    );
  };

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
          className="bg-white shadow-xl"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
          }}
        >
          <div 
            style={{ 
              padding: `${MARGIN_MM}mm`,
              height: '100%',
              overflow: 'hidden'
            }}
            className="relative"
          >
            <div className={cn("mb-6", style.headerStyle)}>
              <h1 className={cn("text-3xl font-bold mb-2", style.titleFont)}>
                <EditableText text={personalInfo.fullName} section="personalInfo" field="fullName" />
              </h1>
              <div className="mb-2">
                <h2 className={cn("text-xl text-gray-600", template.id === "modern-split" ? "uppercase tracking-wide" : "")}>
                  <EditableText text={professionalSummary.title} section="professionalSummary" field="title" />
                </h2>
              </div>
              <div className={cn(
                "text-sm text-gray-600 flex flex-wrap gap-2",
                template.id === "modern-split" ? "flex-col items-start" : "items-center"
              )}>
                {personalInfo.phone && (
                  <span className="inline-flex items-center">
                    <EditableText text={personalInfo.phone} section="personalInfo" field="phone" />
                  </span>
                )}
                {personalInfo.email && (
                  <span className="inline-flex items-center">
                    {template.id !== "modern-split" && <span className="hidden md:inline text-gray-400 mx-2">•</span>}
                    <EditableText text={personalInfo.email} section="personalInfo" field="email" />
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="inline-flex items-center">
                    {template.id !== "modern-split" && <span className="hidden md:inline text-gray-400 mx-2">•</span>}
                    <EditableText text={personalInfo.linkedin} section="personalInfo" field="linkedin" />
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-5 text-sm">
              <div className={style.contentStyle}>
                <h3 className={cn("text-base font-semibold mb-2", style.sectionStyle)}>Professional Summary</h3>
                <div className="text-gray-600 leading-relaxed">
                  <EditableTextArea text={professionalSummary.summary} section="professionalSummary" field="summary" />
                </div>
              </div>

              {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
                <div>
                  <h3 className={cn("text-base font-semibold mb-2", style.sectionStyle)}>Skills</h3>
                  <div className={cn(
                    "text-gray-600",
                    template.id === "modern-split" ? "grid md:grid-cols-2 gap-4" : ""
                  )}>
                    {skills.hard_skills.length > 0 && (
                      <div className="mb-3">
                        {template.id === "modern-split" && <h4 className="font-medium mb-1">Technical Skills</h4>}
                        <p className="flex flex-wrap gap-1.5">
                          {skills.hard_skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div>
                        {template.id === "modern-split" && <h4 className="font-medium mb-1">Soft Skills</h4>}
                        <p className="flex flex-wrap gap-1.5">
                          {skills.soft_skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {workExperience && workExperience.length > 0 && (
                <div>
                  <h3 className={cn("text-base font-semibold mb-2", style.sectionStyle)}>Professional Experience</h3>
                  <div className="space-y-3">
                    {workExperience.map((experience, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium text-gray-800">{experience.companyName}</h4>
                            <div className="text-gray-600">{experience.jobTitle}</div>
                          </div>
                          <div className="text-gray-500 text-xs">
                            <div>{experience.location}</div>
                            <div>
                              {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                            </div>
                          </div>
                        </div>
                        <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
                          {experience.responsibilities.map((resp, idx) => (
                            <li key={idx} className="leading-relaxed">{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education && education.length > 0 && (
                <div>
                  <h3 className={cn("text-base font-semibold mb-2", style.sectionStyle)}>Education</h3>
                  <div className="space-y-2">
                    {education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{edu.schoolName}</h4>
                          <div className="text-gray-600">{edu.degreeName}</div>
                        </div>
                        <div className="text-gray-500 text-xs">
                          {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div>
                  <h3 className={cn("text-base font-semibold mb-2", style.sectionStyle)}>Certifications</h3>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{cert.name}</h4>
                          <div className="text-gray-600">{cert.organization}</div>
                        </div>
                        <div className="text-gray-500 text-xs">
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
