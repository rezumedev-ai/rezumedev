
import { cn } from "@/lib/utils";

interface EditableContentProps {
  content: string;
  isEditing: boolean;
  className?: string;
  onUpdate: (newContent: string) => void;
}

export function EditableContent({ 
  content, 
  isEditing, 
  className,
  onUpdate 
}: EditableContentProps) {
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isEditing) {
      const newContent = event.target.innerText.trim();
      onUpdate(newContent);
    }
  };

  return (
    <div 
      className={cn("outline-none", className)}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {content}
    </div>
  );
}
