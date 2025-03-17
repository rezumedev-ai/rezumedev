
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { formatDateRange } from "@/utils/format-dates";

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
  
  const handleSaveExperience = () => {
    if (!editingExp) return;
    
    const updatedExperiences = [...experiences];
    const index = experiences.findIndex(exp => 
      exp.jobTitle === editingExp.jobTitle && 
      exp.companyName === editingExp.companyName
    );
    
    if (index !== -1) {
      updatedExperiences[index] = editingExp;
    } else {
      updatedExperiences.push(editingExp);
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
  
  const handleUpdateResponsibility = (index: number, value: string) => {
    if (!editingExp) return;
    
    const updatedResponsibilities = [...editingExp.responsibilities];
    updatedResponsibilities[index] = value;
    
    setEditingExp({
      ...editingExp,
      responsibilities: updatedResponsibilities
    });
  };
  
  const handleAddResponsibility = () => {
    if (!editingExp) return;
    
    setEditingExp({
      ...editingExp,
      responsibilities: [...editingExp.responsibilities, ""]
    });
  };
  
  const handleDeleteResponsibility = (index: number) => {
    if (!editingExp) return;
    
    const updatedResponsibilities = [...editingExp.responsibilities];
    updatedResponsibilities.splice(index, 1);
    
    setEditingExp({
      ...editingExp,
      responsibilities: updatedResponsibilities
    });
  };
  
  if (experiences.length === 0 && !isEditing) {
    return null;
  }
  
  return (
    <div className="mt-1">
      <SectionHeader title="Work Experience" type="experience" template={template} />
      
      {editingExp ? (
        <div className="bg-gray-50 p-4 rounded-md mt-2 border border-gray-200">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <Input 
                value={editingExp.jobTitle}
                onChange={(e) => setEditingExp({...editingExp, jobTitle: e.target.value})}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Input 
                  value={editingExp.companyName}
                  onChange={(e) => setEditingExp({...editingExp, companyName: e.target.value})}
                  placeholder="e.g. Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input 
                  value={editingExp.location || ""}
                  onChange={(e) => setEditingExp({...editingExp, location: e.target.value})}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input 
                  value={editingExp.startDate}
                  onChange={(e) => setEditingExp({...editingExp, startDate: e.target.value})}
                  placeholder="e.g. Jan 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={editingExp.endDate}
                    onChange={(e) => setEditingExp({...editingExp, endDate: e.target.value})}
                    placeholder="e.g. Present"
                    disabled={editingExp.isCurrentJob}
                  />
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="current-job"
                      checked={editingExp.isCurrentJob || false}
                      onChange={(e) => setEditingExp({
                        ...editingExp, 
                        isCurrentJob: e.target.checked,
                        endDate: e.target.checked ? "Present" : editingExp.endDate
                      })}
                      className="mr-1"
                    />
                    <label htmlFor="current-job" className="text-xs">Current</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              {editingExp.responsibilities.map((resp, index) => (
                <div key={index} className="flex items-start gap-2 mb-2">
                  <Textarea 
                    value={resp}
                    onChange={(e) => handleUpdateResponsibility(index, e.target.value)}
                    placeholder="Describe your responsibilities and achievements"
                    className="min-h-[80px]"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteResponsibility(index)}
                    disabled={editingExp.responsibilities.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddResponsibility}
                className="mt-1"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Responsibility
              </Button>
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveExperience}>
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className={`pb-3 ${index < experiences.length - 1 ? 'border-b border-gray-200' : ''} cursor-pointer`}
              onClick={() => handleEditExperience(index)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900">{exp.jobTitle}</div>
                  <div className="text-sm text-gray-600">
                    {exp.companyName}
                    {exp.location && <span> • {exp.location}</span>}
                  </div>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </div>
              </div>
              
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="leading-snug">{resp}</li>
                ))}
              </ul>
              
              {isEditing && (
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExperience(index);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              )}
            </div>
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
    </div>
  );
}
