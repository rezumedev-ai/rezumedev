
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, ZoomIn, ZoomOut } from "lucide-react";
import { DownloadOptionsDialog } from "./DownloadOptionsDialog";

interface ResumeHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDownload: (format: "pdf" | "docx") => Promise<void>;
  onToggleZoom?: () => void;
  isZoomed?: boolean;
  isMobile: boolean;
  isEditing?: boolean;
}

export function ResumeHeader({
  onBack,
  onEdit,
  onDownload,
  onToggleZoom,
  isZoomed,
  isMobile,
  isEditing
}: ResumeHeaderProps) {
  return (
    <div className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Resume Preview</h1>
        </div>
        <div className="flex items-center gap-2">
          {isMobile && onToggleZoom && (
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleZoom}
              className="shrink-0"
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={onEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">{isEditing ? "Save" : "Edit"}</span>
          </Button>
          <DownloadOptionsDialog onDownload={onDownload} />
        </div>
      </div>
    </div>
  );
}
