
import { ResumeTemplate } from "../../../templates";
import { cn } from "@/lib/utils";

interface TemplateDetailsProps {
  template: ResumeTemplate;
  isSelected: boolean;
}

export function TemplateDetails({ template, isSelected }: TemplateDetailsProps) {
  return (
    <div className={cn(
      "p-4 border-t border-gray-100",
      isSelected ? "bg-accent/40" : "bg-white"
    )}>
      <h3 className="font-medium text-base">{template.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
    </div>
  );
}
