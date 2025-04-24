
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TemplateSelectionGrid } from "../TemplateSelectionGrid";
import { ResumeTemplate } from "../../templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface TemplateSelectionProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelection({
  currentTemplateId,
  templates,
  onTemplateChange
}: TemplateSelectionProps) {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    onTemplateChange(templateId);
    setIsDialogOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
          >
            <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Template</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
          <TemplateSelectionGrid 
            templates={templates}
            currentTemplateId={currentTemplateId}
            onTemplateChange={onTemplateChange}
          />
        </SheetContent>
      </Sheet>
    );
  }

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
