
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ExperienceItem } from "./experience/ExperienceItem";
import { ExperienceForm } from "./experience/ExperienceForm";
import { SectionContainer } from "../ui/SectionContainer";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  template: ResumeTemplate;
  isEditing: boolean;
  onUpdate: (experiences: WorkExperience[]) => void;
}

export function ExperienceSection({
  experiences = [],
  template,
  isEditing,
  onUpdate
}: ExperienceSectionProps) {
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  
  const handleEditExperience = (index: number) => {
    if (isEditing) {
      setEditingExp({...experiences[index]});
    }
  };
  
  const handleSaveExperience = (updatedExperience: WorkExperience) => {
    const updatedExperiences = [...experiences];
    const index = experiences.findIndex(exp => 
      exp.jobTitle === editingExp?.jobTitle && 
      exp.companyName === editingExp?.companyName
    );
    
    if (index !== -1) {
      updatedExperiences[index] = updatedExperience;
    } else {
      updatedExperiences.push(updatedExperience);
    }
    
    onUpdate(updatedExperiences);
    setEditingExp(null);
  };
  
  const handleCancelEdit = () => {
    setEditingExp(null);
  };
  
  const handleAddExperience = () => {
    setEditingExp({
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: [""]
    });
  };
  
  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    onUpdate(updatedExperiences);
  };
  
  if (experiences.length === 0 && !isEditing) {
    return null;
  }
  
  return (
    <SectionContainer>
      <SectionHeader title="Work Experience" type="experience" template={template} />
      
      {editingExp ? (
        <ExperienceForm 
          experience={editingExp} 
          onSave={handleSaveExperience} 
          onCancel={handleCancelEdit} 
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <ExperienceItem 
              key={index}
              experience={exp}
              template={template}
              isEditing={isEditing}
              onEdit={() => handleEditExperience(index)}
              onDelete={() => handleDeleteExperience(index)}
              onUpdate={(field, value) => {
                const updatedExperiences = [...experiences];
                updatedExperiences[index] = {
                  ...updatedExperiences[index],
                  [field]: value
                };
                onUpdate(updatedExperiences);
              }}
            />
          ))}
          
          {isEditing && (
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleAddExperience}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Work Experience
            </Button>
          )}
        </div>
      )}
    </SectionContainer>
  );
}
