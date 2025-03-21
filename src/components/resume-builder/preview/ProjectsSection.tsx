
import { Project } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { SectionHeader } from "./SectionHeader";
import { formatDateRange } from "@/utils/format-dates";

interface ProjectsSectionProps {
  projects: Project[];
  template: ResumeTemplate;
  isEditing: boolean;
  onUpdate?: (index: number, field: keyof Project, value: string | string[]) => void;
}

export function ProjectsSection({ projects, template, isEditing, onUpdate }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) return null;

  const handleFieldEdit = (index: number, field: keyof Project, event: React.FocusEvent<HTMLElement>) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  return (
    <div className="mt-4">
      <SectionHeader title="Projects" type="projects" template={template} />
      
      <div className="space-y-4 mt-2">
        {projects.map((project, index) => (
          <div key={index} className={template.id === "modern-professional" ? "pb-3" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <div 
                  className="font-semibold text-gray-900"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldEdit(index, "name", e)}
                >
                  {project.name}
                </div>
                
                <div 
                  className="text-sm mt-1 text-gray-700"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldEdit(index, "description", e)}
                >
                  {project.description}
                </div>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="text-xs mt-1 text-gray-600">
                    {template.id === "professional-navy" ? "Technologies: " : ""}
                    <span 
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => handleFieldEdit(index, "technologies", e.target.innerText.split(', '))}
                    >
                      {project.technologies.join(', ')}
                    </span>
                  </div>
                )}
                
                {project.url && (
                  <div 
                    className="text-xs mt-1 text-blue-600"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldEdit(index, "url", e)}
                  >
                    {project.url}
                  </div>
                )}
              </div>
              
              <div 
                className={`text-sm ${template.id === "modern-professional" ? "text-emerald-600 font-medium" : "text-gray-500"} whitespace-nowrap`}
              >
                {formatDateRange(project.startDate, project.endDate || "", project.isOngoing)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
