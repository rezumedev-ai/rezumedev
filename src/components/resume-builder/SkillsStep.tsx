
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Skills {
  hard_skills: string[];
  soft_skills: string[];
}

interface SkillsStepProps {
  formData: Skills;
  onChange: (skills: Skills) => void;
}

export function SkillsStep({ formData, onChange }: SkillsStepProps) {
  const addSkill = (type: 'hard_skills' | 'soft_skills') => {
    onChange({
      ...formData,
      [type]: [...formData[type], ""]
    });
  };

  const removeSkill = (type: 'hard_skills' | 'soft_skills', index: number) => {
    onChange({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  const updateSkill = (type: 'hard_skills' | 'soft_skills', index: number, value: string) => {
    const updatedSkills = [...formData[type]];
    updatedSkills[index] = value;
    onChange({
      ...formData,
      [type]: updatedSkills
    });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Technical Skills</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSkill('hard_skills')}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Skill
          </Button>
        </div>
        <div className="space-y-3">
          {formData.hard_skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill('hard_skills', index, e.target.value)}
                placeholder="e.g. JavaScript, Python, Project Management"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill('hard_skills', index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Soft Skills</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSkill('soft_skills')}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Skill
          </Button>
        </div>
        <div className="space-y-3">
          {formData.soft_skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={skill}
                onChange={(e) => updateSkill('soft_skills', index, e.target.value)}
                placeholder="e.g. Leadership, Communication, Problem Solving"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill('soft_skills', index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
