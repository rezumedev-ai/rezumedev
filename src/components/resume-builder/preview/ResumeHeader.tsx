
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit2, Download } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <Tabs
              defaultValue={selectedTemplate}
              className="w-[400px]"
              onValueChange={onTemplateChange}
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="executive-clean">Classic</TabsTrigger>
                <TabsTrigger value="modern-split">Modern</TabsTrigger>
                <TabsTrigger value="minimal-elegant">Minimal</TabsTrigger>
                <TabsTrigger value="professional-executive">Executive</TabsTrigger>
              </TabsList>
            </Tabs>
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
