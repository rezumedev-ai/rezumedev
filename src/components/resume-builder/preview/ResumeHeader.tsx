
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit2, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resumeTemplates } from "../templates";

interface ResumeHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  isDownloading?: boolean;
  onTemplateChange?: (templateId: string) => void;
  selectedTemplate?: string;
  children?: React.ReactNode;
}

export function ResumeHeader({
  onBack,
  onEdit,
  isEditing,
  isDownloading,
  onTemplateChange,
  selectedTemplate,
  children
}: ResumeHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {onTemplateChange && (
            <Select
              value={selectedTemplate}
              onValueChange={onTemplateChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {resumeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            {isEditing ? "Save Changes" : "Edit Resume"}
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
