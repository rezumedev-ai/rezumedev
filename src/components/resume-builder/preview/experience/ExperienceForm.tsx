
import { WorkExperience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExperienceFormProps {
  experience: WorkExperience;
  onSave: (experience: WorkExperience) => void;
  onCancel: () => void;
}

export function ExperienceForm({ 
  experience, 
  onSave, 
  onCancel 
}: ExperienceFormProps) {
  const [editingExp, setEditingExp] = useState<WorkExperience>({...experience});
  
  const handleUpdateResponsibility = (index: number, value: string) => {
    const updatedResponsibilities = [...editingExp.responsibilities];
    updatedResponsibilities[index] = value;
    
    setEditingExp({
      ...editingExp,
      responsibilities: updatedResponsibilities
    });
  };
  
  const handleAddResponsibility = () => {
    setEditingExp({
      ...editingExp,
      responsibilities: [...editingExp.responsibilities, ""]
    });
  };
  
  const handleDeleteResponsibility = (index: number) => {
    const updatedResponsibilities = [...editingExp.responsibilities];
    updatedResponsibilities.splice(index, 1);
    
    setEditingExp({
      ...editingExp,
      responsibilities: updatedResponsibilities
    });
  };
  
  return (
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editingExp)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
