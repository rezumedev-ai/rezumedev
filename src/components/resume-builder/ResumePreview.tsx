import { WorkExperience } from "@/types/resume";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  isEditable = false,
  onUpdate
}: ResumePreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

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
    // Close editing mode
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
    
    if (!isEditable) return <p>{text}</p>;

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
        className="cursor-pointer hover:bg-gray-100 px-1 rounded"
      >
        {text}
      </p>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-8 shadow-sm text-[#333]">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#333] uppercase tracking-wide">
          <EditableText text={personalInfo.fullName} section="personalInfo" field="fullName" />
        </h1>
        <h2 className="text-lg text-gray-600 mb-3">
          <EditableText text={professionalSummary.title} section="professionalSummary" field="title" />
        </h2>
        <div className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
          {personalInfo.phone && (
            <EditableText text={personalInfo.phone} section="personalInfo" field="phone" />
          )}
          {personalInfo.email && (
            <>
              <span className="text-gray-400">•</span>
              <EditableText text={personalInfo.email} section="personalInfo" field="email" />
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <EditableText text={personalInfo.linkedin} section="personalInfo" field="linkedin" />
            </>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
          Summary
        </h3>
        <EditableTextArea text={professionalSummary.summary} section="professionalSummary" field="summary" />
      </div>

      {/* Skills Section */}
      {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Skills
          </h3>
          <p className="text-sm text-gray-700">
            {[...skills.hard_skills, ...skills.soft_skills].join(' • ')}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {workExperience && workExperience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Experience
          </h3>
          <div className="space-y-4">
            {workExperience.map((experience, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-semibold text-[#333]">{experience.companyName}</h4>
                    <div className="text-gray-700 font-medium">{experience.jobTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">{experience.location}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                    </div>
                  </div>
                </div>
                <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
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
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#333]">{edu.schoolName}</h4>
                  <div className="text-gray-700">{edu.degreeName}</div>
                </div>
                <div className="text-right">
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
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Certifications
          </h3>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#333]">{cert.name}</h4>
                  <div className="text-sm text-gray-700">{cert.organization}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(cert.completionDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
