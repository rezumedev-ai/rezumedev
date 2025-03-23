
import { cn } from "@/lib/utils";

interface EditableContentProps {
  content?: string;  // Make this optional
  value?: string;    // Add value as an alternative to content
  isEditing: boolean;
  className?: string;
  onUpdate: (newContent: string) => void;
  onChange?: (newContent: string) => void; // Add onChange as an alternative
}

export function EditableContent({ 
  content, 
  value, 
  isEditing, 
  className,
  onUpdate,
  onChange
}: EditableContentProps) {
  // Use content or value, prioritizing value if both are provided
  const displayContent = value !== undefined ? value : content || '';
  
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (isEditing) {
      const newContent = event.target.innerText.trim();
      // Use both callbacks if provided
      if (onUpdate) onUpdate(newContent);
      if (onChange) onChange(newContent);
    }
  };

  return (
    <div 
      className={cn("outline-none", className)}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {displayContent}
    </div>
  );
}
