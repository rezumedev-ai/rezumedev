
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface TitleEditorProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function TitleEditor({ title, onSave }: TitleEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  
  const startEditing = () => {
    setIsEditing(true);
    setEditTitle(title);
  };
  
  const handleSave = () => {
    onSave(editTitle);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <motion.div 
        className="flex gap-2 items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 border-primary/20 focus:border-primary/40"
          placeholder="Enter resume title"
          autoFocus
        />
        <motion.button 
          onClick={handleSave}
          className="p-2 hover:bg-green-50 rounded-full text-green-600"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Check className="w-4 h-4" />
        </motion.button>
        <motion.button 
          onClick={() => setIsEditing(false)}
          className="p-2 hover:bg-red-50 rounded-full text-red-600"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <h3 className="font-semibold text-gray-900 break-words group-hover:text-primary/90 transition-colors">
        {title}
      </h3>
      <motion.button 
        onClick={startEditing}
        className="p-1 h-auto hover:bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
      </motion.button>
    </div>
  );
}
