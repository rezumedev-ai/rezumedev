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

  // Standard US Letter size in inches
  const PAGE_SIZE = {
    width: 8.5,
    height: 11
  };

  // Convert to pixels (1 inch = 96px)
  const PIXELS_PER_INCH = 96;
  
  const PAGE_SIZE_PX = {
    width: PAGE_SIZE.width * PIXELS_PER_INCH,
    height: PAGE_SIZE.height * PIXELS_PER_INCH
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate scale to fit within container while maintaining aspect ratio
        const scaleX = (containerWidth - 48) / PAGE_SIZE_PX.width;
        const scaleY = (containerHeight - 48) / PAGE_SIZE_PX.height;
        
        // Use the smaller scale to ensure it fits both dimensions
        let newScale = Math.min(scaleX, scaleY, 1);
        
        if (isMobile) {
          newScale = isZoomed ? 0.8 : 0.4;
        } else {
          newScale = Math.min(newScale, 0.85);
        }
        
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

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
        className="w-full h-full flex items-center justify-center p-6"
      >
        <div 
          ref={resumeRef}
          id="resume-content"
          className={cn(
            "bg-white shadow-xl",
            selectedTemplate.style.titleFont
          )}
          style={{
            width: `${PAGE_SIZE_PX.width}px`,
            height: `${PAGE_SIZE_PX.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            // Force exact US Letter dimensions
            minWidth: `${PAGE_SIZE_PX.width}px`,
            maxWidth: `${PAGE_SIZE_PX.width}px`,
            minHeight: `${PAGE_SIZE_PX.height}px`,
            maxHeight: `${PAGE_SIZE_PX.height}px`,
            margin: '0 auto',
            padding: '0',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              padding: '1in',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {/* Header Section */}
            <div className={selectedTemplate.style.headerStyle}>
              <h1 className={selectedTemplate.style.titleFont}>
                {personalInfo.fullName}
              </h1>
              <h2 className="text-xl text-gray-600 mt-2">
                {professionalSummary.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span>{personalInfo.email}</span>
                <span>{personalInfo.phone}</span>
                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              </div>
            </div>

            <div 
              className={cn(selectedTemplate.style.contentStyle, "overflow-hidden")}
              style={{
                height: 'calc(100% - 120px)'
              }}
            >
              {/* Professional Summary */}
              <div>
                <h3 className={selectedTemplate.style.sectionStyle}>Professional Summary</h3>
                <p className="text-gray-700 mt-2">{professionalSummary.summary}</p>
              </div>

              {/* Work Experience */}
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

              {/* Education */}
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

              {/* Skills */}
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

              {/* Certifications */}
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
