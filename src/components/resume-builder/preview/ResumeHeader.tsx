
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ResumeHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  isDownloading: boolean;
  children?: ReactNode;
}

export function ResumeHeader({
  onBack,
  onEdit,
  isEditing,
  isDownloading,
  children
}: ResumeHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Save" : "Edit"}
            </Button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
