
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface EditButtonProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

export function EditButton({ isEditing, onToggleEdit }: EditButtonProps) {
  return (
    <Button 
      onClick={onToggleEdit} 
      variant="outline"
      className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
    >
      {isEditing ? (
        <>
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Save</span>
        </>
      ) : (
        <>
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Edit</span>
        </>
      )}
    </Button>
  );
}
