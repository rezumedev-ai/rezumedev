
import { Input } from "@/components/ui/input";
import { WorkExperience } from "@/types/resume";

interface ExperienceFormProps {
  experience: WorkExperience;
  index: number;
  onUpdate: (field: keyof WorkExperience, value: any) => void;
}

export function ExperienceForm({ experience, index, onUpdate }: ExperienceFormProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Job Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={experience.jobTitle}
          onChange={(e) => onUpdate("jobTitle", e.target.value)}
          placeholder="e.g. Senior Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={experience.companyName}
          onChange={(e) => onUpdate("companyName", e.target.value)}
          placeholder="e.g. Tech Corp Inc."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <Input
          value={experience.location || ""}
          onChange={(e) => onUpdate("location", e.target.value)}
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Start Date <span className="text-red-500">*</span>
        </label>
        <Input
          type="month"
          value={experience.startDate}
          onChange={(e) => onUpdate("startDate", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          End Date {!experience.isCurrentJob && <span className="text-red-500">*</span>}
        </label>
        <Input
          type="month"
          value={experience.endDate}
          onChange={(e) => onUpdate("endDate", e.target.value)}
          disabled={experience.isCurrentJob}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`current-job-${index}`}
          checked={experience.isCurrentJob}
          onChange={(e) => onUpdate("isCurrentJob", e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor={`current-job-${index}`} className="text-sm text-gray-700">
          I currently work here
        </label>
      </div>
    </div>
  );
}
