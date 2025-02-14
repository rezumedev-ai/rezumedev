import { WorkExperience } from "@/types/resume";
import { formatDate, cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resumeTemplates } from "./templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    <div 
      className="relative w-full h-full"
      style={{
        transform: isMobile ? 'scale(0.45)' : 'none',
        transformOrigin: 'top center',
        height: isMobile ? '220%' : '100%'
      }}
    >
      <div 
        className="bg-white absolute inset-0"
        style={{ 
          width: '21cm',
          minHeight: '29.7cm',
          margin: '0 auto'
        }}
      >
        <ScrollArea className={cn("h-full", { "pointer-events-none": isMobile })}>
          <div className="p-[2cm]">
            <div className={cn("mb-6", style.headerStyle)}>
              <h1 className={cn("text-3xl font-bold mb-3", style.titleFont)}>
                <EditableText text={personalInfo.fullName} section="personalInfo" field="fullName" />
              </h1>
              <div className="mb-3">
                <h2 className={cn("text-xl text-gray-600", template.id === "modern-split" ? "uppercase tracking-wide" : "")}>
                  <EditableText text={professionalSummary.title} section="professionalSummary" field="title" />
                </h2>
              </div>
              <div className={cn(
                "text-sm text-gray-600 flex flex-wrap gap-2",
                template.id === "modern-split" ? "flex-col items-start" : "items-center"
              )}>
                {personalInfo.phone && (
                  <span className="inline-flex items-center break-all">
                    <EditableText text={personalInfo.phone} section="personalInfo" field="phone" />
                  </span>
                )}
                {personalInfo.email && (
                  <span className="inline-flex items-center break-all">
                    {template.id !== "modern-split" && <span className="hidden md:inline text-gray-400 mx-2">•</span>}
                    <EditableText text={personalInfo.email} section="personalInfo" field="email" />
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="inline-flex items-center break-all">
                    {template.id !== "modern-split" && <span className="hidden md:inline text-gray-400 mx-2">•</span>}
                    <EditableText text={personalInfo.linkedin} section="personalInfo" field="linkedin" />
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={style.contentStyle}>
                <h3 className={style.sectionStyle}>Professional Summary</h3>
                <EditableTextArea text={professionalSummary.summary} section="professionalSummary" field="summary" />
              </div>

              {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
                <div>
                  <h3 className={style.sectionStyle}>Skills</h3>
                  <div className={cn(
                    "text-sm md:text-base text-gray-700",
                    template.id === "modern-split" ? "grid md:grid-cols-2 gap-4" : ""
                  )}>
                    {skills.hard_skills.length > 0 && (
                      <div className="mb-4 md:mb-0">
                        {template.id === "modern-split" && <h4 className="font-medium mb-2">Technical Skills</h4>}
                        <p className="flex flex-wrap gap-2">
                          {skills.hard_skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div>
                        {template.id === "modern-split" && <h4 className="font-medium mb-2">Soft Skills</h4>}
                        <p className="flex flex-wrap gap-2">
                          {skills.soft_skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
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
                  <h3 className={style.sectionStyle}>Professional Experience</h3>
                  <div className={cn(
                    "space-y-4 md:space-y-6",
                    template.id === "modern-split" ? "grid gap-4 md:gap-6" : ""
                  )}>
                    {workExperience.map((experience, index) => (
                      <div key={index} className={cn(
                        "border-b border-gray-100 pb-4 last:border-0 last:pb-0",
                        template.id === "modern-split" ? "grid md:grid-cols-[1fr_2fr] gap-4" : ""
                      )}>
                        <div className={cn(
                          template.id === "modern-split" ? "" : "flex flex-col md:flex-row justify-between items-start mb-2"
                        )}>
                          <div>
                            <h4 className="font-semibold text-[#333]">{experience.companyName}</h4>
                            <div className="text-gray-700 font-medium">{experience.jobTitle}</div>
                          </div>
                          <div className={cn(
                            "text-sm text-gray-600",
                            template.id === "modern-split" ? "mt-1" : "md:text-right"
                          )}>
                            <div>{experience.location}</div>
                            <div>
                              {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                            </div>
                          </div>
                        </div>
                        <ul className={cn(
                          "list-disc ml-4 text-sm md:text-base text-gray-700 space-y-1",
                          template.id === "modern-split" ? "mt-0" : "mt-2"
                        )}>
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
                  <h3 className={style.sectionStyle}>Education</h3>
                  <div className={cn(
                    "space-y-3 md:space-y-4",
                    template.id === "modern-split" ? "grid gap-3 md:gap-4" : ""
                  )}>
                    {education.map((edu, index) => (
                      <div key={index} className={cn(
                        "border-b border-gray-100 pb-4 last:border-0 last:pb-0",
                        template.id === "modern-split" ? "grid md:grid-cols-[1fr_2fr] gap-4" : "flex flex-col md:flex-row justify-between items-start"
                      )}>
                        <div>
                          <h4 className="font-semibold text-[#333]">{edu.schoolName}</h4>
                          <div className="text-gray-700">{edu.degreeName}</div>
                        </div>
                        <div className={cn("text-sm text-gray-600", template.id === "modern-split" ? "" : "md:text-right")}>
                          {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div>
                  <h3 className={style.sectionStyle}>Certifications</h3>
                  <div className={cn(
                    "space-y-3 md:space-y-4",
                    template.id === "modern-split" ? "grid gap-3 md:gap-4" : ""
                  )}>
                    {certifications.map((cert, index) => (
                      <div key={index} className={cn(
                        "border-b border-gray-100 pb-4 last:border-0 last:pb-0",
                        template.id === "modern-split" ? "grid md:grid-cols-[1fr_2fr] gap-4" : "flex flex-col md:flex-row justify-between items-start"
                      )}>
                        <div>
                          <h4 className="font-semibold text-[#333]">{cert.name}</h4>
                          <div className="text-sm text-gray-700">{cert.organization}</div>
                        </div>
                        <div className={cn("text-sm text-gray-600", template.id === "modern-split" ? "" : "md:text-right")}>
                          {formatDate(cert.completionDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
