
import { cn } from "@/lib/utils";

interface EditableContentProps {
  value: string;
  isEditing: boolean;
  className?: string;
  onChange: (newValue: string) => void;
}

export function EditableContent({ 
  value, 
  isEditing, 
  className,
  onChange 
}: EditableContentProps) {
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isEditing) {
      const newContent = event.target.innerText.trim();
      onChange(newContent);
    }
  };

  return (
    <div 
      className={cn("outline-none", className)}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {value}
    </div>
  );
}
