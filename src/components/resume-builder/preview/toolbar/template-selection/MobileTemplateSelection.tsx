
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { ResumeTemplate } from "../../../templates";
import { useState } from "react";
import { MobileTemplateSelector } from "./MobileTemplateSelector";

interface MobileTemplateSelectionProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  onTemplateChange: (templateId: string) => void;
}

export function MobileTemplateSelection({
  currentTemplateId,
  templates,
  onTemplateChange
}: MobileTemplateSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        onClick={() => setIsOpen(true)}
      >
        <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Template</span>
      </Button>

      <MobileTemplateSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        templates={templates}
        currentTemplateId={currentTemplateId}
        onTemplateChange={onTemplateChange}
      />
    </>
  );
}
