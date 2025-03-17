
import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ResumeTitleEditorProps {
  resumeId: string;
  initialTitle: string;
}

export function ResumeTitleEditor({ resumeId, initialTitle }: ResumeTitleEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const startEditingTitle = () => {
    setEditingTitle(true);
    setEditTitle(initialTitle || "Untitled");
  };

  const saveTitle = async () => {
    const { error } = await supabase
      .from('resumes')
      .update({ title: editTitle })
      .eq('id', resumeId);

    if (error) {
      toast({
        title: "Error",
        description: "Could not update resume title",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Resume title updated",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
    setEditingTitle(false);
  };

  return (
    <div>
      {editingTitle ? (
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
            onClick={saveTitle}
            className="p-2 hover:bg-green-50 rounded-full text-green-600"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button 
            onClick={() => setEditingTitle(false)}
            className="p-2 hover:bg-red-50 rounded-full text-red-600"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 break-words group-hover:text-primary/90 transition-colors">
            {initialTitle}
          </h3>
          <motion.button 
            onClick={startEditingTitle}
            className="p-1 h-auto hover:bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
