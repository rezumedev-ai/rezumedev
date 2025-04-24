
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TemplateSelectionGrid } from "../../TemplateSelectionGrid";
import { ResumeTemplate } from "../../../templates";
import { useState } from "react";

interface DesktopTemplateSelectionProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  onTemplateChange: (templateId: string) => void;
}

export function DesktopTemplateSelection({
  currentTemplateId,
  templates,
  onTemplateChange
}: DesktopTemplateSelectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    onTemplateChange(templateId);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-100 text-sm px-3 py-2 h-auto"
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Change Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
        <TemplateSelectionGrid 
          templates={templates}
          currentTemplateId={currentTemplateId}
          onTemplateChange={handleTemplateChange}
        />
      </DialogContent>
    </Dialog>
  );
}
