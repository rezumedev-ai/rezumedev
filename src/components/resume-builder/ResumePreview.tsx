
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

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN = 40;

  const toggleZoom = () => {
    setIsZoomed(prev => !prev);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        const scaleX = (containerWidth - 48) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 48) / A4_HEIGHT_PX;
        
        let newScale = Math.min(scaleX, scaleY);
        
        if (isMobile) {
          newScale = isZoomed ? 0.95 : 0.35;
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
          className="w-full max-w-[200px]"
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
          className="w-full min-h-[100px] text-sm"
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

  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

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
            className="h-full overflow-hidden"
            style={{ 
              padding: `${MARGIN}px`,
              display: 'grid',
              gridTemplateColumns: '250px 1fr',
              gap: '40px',
              maxHeight: `${A4_HEIGHT_PX}px`,
            }}
          >
            {/* Left Column - Fixed width */}
            <div className="space-y-6 overflow-hidden">
              <div>
                <h2 className="text-base font-semibold mb-2 uppercase tracking-wide">Contact</h2>
                <div className="space-y-1 text-sm">
                  <div>{personalInfo.phone}</div>
                  <div className="break-all">{personalInfo.email}</div>
                  {personalInfo.linkedin && <div className="break-all">{personalInfo.linkedin}</div>}
                </div>
              </div>

              {education && education.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold mb-2 uppercase tracking-wide">Education</h2>
                  <div className="space-y-3">
                    {education.map((edu, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{edu.schoolName}</div>
                        <div className="text-gray-600">{edu.degreeName}</div>
                        <div className="text-gray-500">
                          {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
                <div>
                  <h2 className="text-base font-semibold mb-2 uppercase tracking-wide">Skills</h2>
                  <div className="space-y-2">
                    {skills.hard_skills.length > 0 && (
                      <div className="text-sm space-y-1">
                        {skills.hard_skills.map((skill, index) => (
                          <div key={index}>{skill}</div>
                        ))}
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div className="text-sm space-y-1">
                        {skills.soft_skills.map((skill, index) => (
                          <div key={index}>{skill}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold mb-2 uppercase tracking-wide">Certifications</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-gray-600">{cert.organization}</div>
                        <div className="text-gray-500">{formatDate(cert.completionDate)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Flexible width */}
            <div className="space-y-6 overflow-hidden">
              <div>
                <h1 className="text-2xl font-bold tracking-wide mb-1">
                  <EditableText text={personalInfo.fullName} section="personalInfo" field="fullName" />
                </h1>
                <h2 className="text-lg text-gray-600 mb-4">
                  <EditableText text={professionalSummary.title} section="professionalSummary" field="title" />
                </h2>
                <div>
                  <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Profile</h3>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <EditableTextArea text={professionalSummary.summary} section="professionalSummary" field="summary" />
                  </div>
                </div>
              </div>

              {workExperience && workExperience.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Work Experience</h3>
                  <div className="space-y-4">
                    {workExperience.map((experience, index) => (
                      <div key={index} className="pb-4 last:pb-0">
                        <div className="mb-2">
                          <h4 className="text-sm font-medium">{experience.jobTitle}</h4>
                          <div className="text-sm text-gray-600">{experience.companyName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                          </div>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4">
                          {experience.responsibilities.map((resp, idx) => (
                            <li key={idx} className="leading-relaxed">{resp}</li>
                          ))}
                        </ul>
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
