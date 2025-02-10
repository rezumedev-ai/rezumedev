
import { WorkExperience } from "@/pages/ResumeBuilder";
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
    <div className="prose max-w-none">
      <div className="space-y-6">
        {/* Personal Information Preview */}
        <div>
          <h4 className="text-xl font-bold">{personalInfo.fullName}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {/* Professional Summary Preview */}
        {professionalSummary.title && (
          <div>
            <h4 className="font-medium text-gray-900">
              {professionalSummary.title}
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              {professionalSummary.summary}
            </p>
          </div>
        )}

        {/* Work Experience Preview */}
        {workExperience && workExperience.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Work Experience</h4>
            <div className="space-y-4 mt-2">
              {workExperience.map((experience, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h5 className="font-medium text-gray-800">{experience.jobTitle}</h5>
                  <p className="text-sm text-gray-600">{experience.companyName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
                    {experience.location && ` • ${experience.location}`}
                  </p>
                  <ul className="list-disc ml-4 mt-2">
                    {experience.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Preview */}
        {education && education.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Education</h4>
            <div className="space-y-4 mt-2">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h5 className="font-medium text-gray-800">{edu.degreeName}</h5>
                  <p className="text-sm text-gray-600">{edu.schoolName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Preview */}
        {skills && (skills.hard_skills.length > 0 || skills.soft_skills.length > 0) && (
          <div>
            <h4 className="font-medium text-gray-900">Skills</h4>
            {skills.hard_skills.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700">Technical Skills</h5>
                <p className="text-sm text-gray-600">
                  {skills.hard_skills.join(", ")}
                </p>
              </div>
            )}
            {skills.soft_skills.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700">Soft Skills</h5>
                <p className="text-sm text-gray-600">
                  {skills.soft_skills.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Certifications Preview */}
        {certifications && certifications.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Certifications</h4>
            <div className="space-y-2 mt-2">
              {certifications.map((cert, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h5 className="font-medium text-gray-800">{cert.name}</h5>
                  <p className="text-sm text-gray-600">{cert.organization}</p>
                  <p className="text-sm text-gray-500">
                    Completed: {formatDate(cert.completionDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
