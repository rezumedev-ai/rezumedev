
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

interface ResumeHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDownload: (format: "pdf" | "docx") => Promise<void>;
  onToggleZoom: () => void;
  isZoomed: boolean;
  isMobile: boolean;
  isEditing: boolean;
  isDownloading: boolean;
}

export function ResumeHeader({
  onBack,
  onEdit,
  onDownload,
  onToggleZoom,
  isZoomed,
  isMobile,
  isEditing,
  isDownloading
}: ResumeHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleZoom}
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant={isEditing ? "secondary" : "ghost"}
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => onDownload('pdf')}
              disabled={isDownloading}
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button
              onClick={() => onDownload('docx')}
              disabled={isDownloading}
              variant="secondary"
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">DOCX</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
