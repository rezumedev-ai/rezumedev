
import { WorkExperience } from "@/types/resume";
import { formatDate } from "@/lib/utils";

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
}

export function ResumePreview({
  personalInfo,
  professionalSummary,
  workExperience,
  education,
  skills,
  certifications
}: ResumePreviewProps) {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-8 shadow-sm text-[#333]">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#333] uppercase tracking-wide">
          {personalInfo.fullName}
        </h1>
        <h2 className="text-lg text-gray-600 mb-3">
          {professionalSummary.title}
        </h2>
        <div className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
          {personalInfo.phone && (
            <span className="flex items-center">
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <>
              <span className="text-gray-400">•</span>
              <span>{personalInfo.email}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
          Summary
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">
          {professionalSummary.summary}
        </p>
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
