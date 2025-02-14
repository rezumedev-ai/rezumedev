
import { WorkExperience } from "@/types/resume";
import { formatDate, cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resumeTemplates } from "./templates";

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
    <div className={cn("max-w-[800px] mx-auto bg-white p-8 shadow-sm text-gray-900", template.style.contentStyle)}>
      {/* Header Section */}
      <div className={style.headerStyle}>
        <h1 className={style.titleFont}>
          <EditableText text={personalInfo.fullName} section="personalInfo" field="fullName" />
        </h1>
        <div className={cn(template.id === "modern-split" ? "mt-2" : "mt-4")}>
          <h2 className={cn("text-gray-600", template.id === "modern-split" ? "text-lg uppercase tracking-wide" : "text-xl")}>
            <EditableText text={professionalSummary.title} section="professionalSummary" field="title" />
          </h2>
        </div>
        <div className={cn(
          "text-sm text-gray-600 flex gap-2 flex-wrap mt-4",
          template.id === "modern-split" ? "flex-col items-start" : "items-center justify-center"
        )}>
          {personalInfo.phone && (
            <EditableText text={personalInfo.phone} section="personalInfo" field="phone" />
          )}
          {personalInfo.email && (
            <>
              {template.id !== "modern-split" && <span className="text-gray-400">•</span>}
              <EditableText text={personalInfo.email} section="personalInfo" field="email" />
            </>
          )}
          {personalInfo.linkedin && (
            <>
              {template.id !== "modern-split" && <span className="text-gray-400">•</span>}
              <EditableText text={personalInfo.linkedin} section="personalInfo" field="linkedin" />
            </>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className={cn("mb-8", style.contentStyle)}>
        <h3 className={style.sectionStyle}>Professional Summary</h3>
        <EditableTextArea text={professionalSummary.summary} section="professionalSummary" field="summary" />
      </div>

      {/* Skills Section */}
      {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
        <div className="mb-6">
          <h3 className={style.sectionStyle}>Skills</h3>
          <div className={cn(
            "text-sm text-gray-700",
            template.id === "modern-split" ? "grid grid-cols-2 gap-4" : ""
          )}>
            {skills.hard_skills.length > 0 && (
              <div>
                {template.id === "modern-split" && <h4 className="font-medium mb-2">Technical Skills</h4>}
                <p>{skills.hard_skills.join(' • ')}</p>
              </div>
            )}
            {skills.soft_skills.length > 0 && (
              <div>
                {template.id === "modern-split" && <h4 className="font-medium mb-2">Soft Skills</h4>}
                <p>{skills.soft_skills.join(' • ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {workExperience && workExperience.length > 0 && (
        <div className="mb-6">
          <h3 className={style.sectionStyle}>Professional Experience</h3>
          <div className={cn(
            "space-y-4",
            template.id === "modern-split" ? "grid gap-6" : ""
          )}>
            {workExperience.map((experience, index) => (
              <div key={index} className={cn(
                template.id === "modern-split" ? "grid grid-cols-[1fr_2fr] gap-4" : ""
              )}>
                <div className={cn(
                  template.id === "modern-split" ? "" : "flex justify-between items-start mb-1"
                )}>
                  <div>
                    <h4 className="font-semibold text-[#333]">{experience.companyName}</h4>
                    <div className="text-gray-700 font-medium">{experience.jobTitle}</div>
                  </div>
                  <div className={cn(
                    template.id === "modern-split" ? "mt-1" : "text-right"
                  )}>
                    <div className="text-gray-600">{experience.location}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                    </div>
                  </div>
                </div>
                <ul className={cn(
                  "list-disc ml-4 text-sm text-gray-700 space-y-1",
                  template.id === "modern-split" ? "mt-0" : "mt-2"
                )}>
                  {experience.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h3 className={style.sectionStyle}>Education</h3>
          <div className={cn(
            "space-y-4",
            template.id === "modern-split" ? "grid gap-4" : ""
          )}>
            {education.map((edu, index) => (
              <div key={index} className={cn(
                template.id === "modern-split" ? "grid grid-cols-[1fr_2fr] gap-4" : "flex justify-between items-start"
              )}>
                <div>
                  <h4 className="font-semibold text-[#333]">{edu.schoolName}</h4>
                  <div className="text-gray-700">{edu.degreeName}</div>
                </div>
                <div className={template.id === "modern-split" ? "" : "text-right"}>
                  <div className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h3 className={style.sectionStyle}>Certifications</h3>
          <div className={cn(
            "space-y-2",
            template.id === "modern-split" ? "grid gap-4" : ""
          )}>
            {certifications.map((cert, index) => (
              <div key={index} className={cn(
                template.id === "modern-split" ? "grid grid-cols-[1fr_2fr] gap-4" : "flex justify-between items-start"
              )}>
                <div>
                  <h4 className="font-semibold text-[#333]">{cert.name}</h4>
                  <div className="text-sm text-gray-700">{cert.organization}</div>
                </div>
                <div className={template.id === "modern-split" ? "" : "text-right"}>
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.completionDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
