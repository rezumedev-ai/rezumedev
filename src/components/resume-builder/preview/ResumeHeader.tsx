
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, ZoomIn, ZoomOut } from "lucide-react";

interface ResumeHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onToggleZoom?: () => void;
  isZoomed?: boolean;
  isMobile: boolean;
}

export function ResumeHeader({
  onBack,
  onEdit,
  onDownload,
  onToggleZoom,
  isZoomed,
  isMobile
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
            variant="outline"
            onClick={onEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            onClick={onDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
