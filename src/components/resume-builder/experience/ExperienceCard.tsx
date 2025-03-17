
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Briefcase } from "lucide-react";
import { WorkExperience } from "@/types/resume";
import { ResponsibilitiesSection } from "./ResponsibilitiesSection";

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  onUpdate: (field: keyof WorkExperience, value: any) => void;
  onRemove: () => void;
  hideResponsibilities?: boolean;
}

export function ExperienceCard({ 
  experience, 
  index, 
  onUpdate, 
  onRemove,
  hideResponsibilities = false 
}: ExperienceCardProps) {
  return (
    <Card className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 text-primary">
        <Briefcase className="w-5 h-5" />
        <h3 className="font-medium">Experience {index + 1}</h3>
      </div>

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
      
      {!hideResponsibilities && (
        <ResponsibilitiesSection 
          responsibilities={experience.responsibilities} 
          onUpdate={(value) => onUpdate("responsibilities", value)}
          jobTitle={experience.jobTitle}
        />
      )}
    </Card>
  );
}
