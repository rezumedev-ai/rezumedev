
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
}

export function ResumePreview({ personalInfo, professionalSummary }: ResumePreviewProps) {
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
      </div>
    </div>
  );
}
