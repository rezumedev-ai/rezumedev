
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Education {
  degreeName: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  isCurrentlyEnrolled?: boolean;
}

interface EducationStepProps {
  formData: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationStep({ formData, onChange }: EducationStepProps) {
  const addEducation = () => {
    onChange([
      ...formData,
      {
        degreeName: "",
        schoolName: "",
        startDate: "",
        endDate: "",
        isCurrentlyEnrolled: false
      }
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(formData.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updatedEducation = formData.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updatedEducation);
  };

  return (
    <div className="space-y-6">
      {formData.map((education, index) => (
        <Card key={index} className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
            onClick={() => removeEducation(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 text-primary">
            <GraduationCap className="w-5 h-5" />
            <h3 className="font-medium">Education {index + 1}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Degree Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={education.degreeName}
                onChange={(e) => updateEducation(index, "degreeName", e.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                School Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={education.schoolName}
                onChange={(e) => updateEducation(index, "schoolName", e.target.value)}
                placeholder="e.g. University of Technology"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="month"
                value={education.startDate}
                onChange={(e) => updateEducation(index, "startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Date {!education.isCurrentlyEnrolled && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="month"
                value={education.endDate}
                onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                disabled={education.isCurrentlyEnrolled}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-education-${index}`}
                checked={education.isCurrentlyEnrolled}
                onChange={(e) => updateEducation(index, "isCurrentlyEnrolled", e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`current-education-${index}`} className="text-sm text-gray-700">
                I am currently enrolled here
              </label>
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={addEducation}
        variant="outline"
        className="w-full py-8 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
