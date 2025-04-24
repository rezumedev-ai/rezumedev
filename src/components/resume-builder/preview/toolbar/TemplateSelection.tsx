
import { ResumeTemplate } from "../../templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTemplateSelection } from "./template-selection/MobileTemplateSelection";
import { DesktopTemplateSelection } from "./template-selection/DesktopTemplateSelection";

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

  return isMobile ? (
    <MobileTemplateSelection
      currentTemplateId={currentTemplateId}
      templates={templates}
      onTemplateChange={onTemplateChange}
    />
  ) : (
    <DesktopTemplateSelection
      currentTemplateId={currentTemplateId}
      templates={templates}
      onTemplateChange={onTemplateChange}
    />
  );
}
