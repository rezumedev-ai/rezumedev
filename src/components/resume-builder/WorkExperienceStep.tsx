
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { WorkExperience } from "@/pages/ResumeBuilder";
import { Card } from "@/components/ui/card";

interface WorkExperienceStepProps {
  formData: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export function WorkExperienceStep({ formData, onChange }: WorkExperienceStepProps) {
  const addExperience = () => {
    onChange([
      ...formData,
      {
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
        responsibilities: [""]
      }
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(formData.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updatedExperiences = formData.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const addResponsibility = (experienceIndex: number) => {
    const updatedExperiences = formData.map((exp, i) => {
      if (i === experienceIndex) {
        return {
          ...exp,
          responsibilities: [...exp.responsibilities, ""]
        };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const updateResponsibility = (experienceIndex: number, respIndex: number, value: string) => {
    const updatedExperiences = formData.map((exp, i) => {
      if (i === experienceIndex) {
        const updatedResponsibilities = exp.responsibilities.map((resp, ri) =>
          ri === respIndex ? value : resp
        );
        return { ...exp, responsibilities: updatedResponsibilities };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const removeResponsibility = (experienceIndex: number, respIndex: number) => {
    const updatedExperiences = formData.map((exp, i) => {
      if (i === experienceIndex) {
        return {
          ...exp,
          responsibilities: exp.responsibilities.filter((_, ri) => ri !== respIndex)
        };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      {formData.map((experience, index) => (
        <Card key={index} className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
            onClick={() => removeExperience(index)}
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
                onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={experience.companyName}
                onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                placeholder="e.g. Tech Corp Inc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                value={experience.location || ""}
                onChange={(e) => updateExperience(index, "location", e.target.value)}
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
                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Date {!experience.isCurrentJob && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="month"
                value={experience.endDate}
                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                disabled={experience.isCurrentJob}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-job-${index}`}
                checked={experience.isCurrentJob}
                onChange={(e) => updateExperience(index, "isCurrentJob", e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`current-job-${index}`} className="text-sm text-gray-700">
                I currently work here
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Key Responsibilities <span className="text-red-500">*</span>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addResponsibility(index)}
                className="text-xs"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Responsibility
              </Button>
            </div>

            {experience.responsibilities.map((resp, respIndex) => (
              <div key={respIndex} className="flex gap-2">
                <Textarea
                  value={resp}
                  onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                  placeholder="e.g. Led a team of 5 developers in developing a new feature"
                  className="flex-1"
                />
                {experience.responsibilities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResponsibility(index, respIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Button
        onClick={addExperience}
        variant="outline"
        className="w-full py-8 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
}
