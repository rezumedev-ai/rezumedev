
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResponsibilityInputProps {
  value: string;
  index: number;
  jobTitle?: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function ResponsibilityInput({
  value,
  index,
  jobTitle,
  onChange,
  onRemove
}: ResponsibilityInputProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleAiEnhance = async () => {
    if (!value.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to enhance first.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);

    try {
      console.log('Calling enhance-responsibility with:', { text: value, jobTitle });

      const { data, error } = await supabase.functions.invoke('enhance-responsibility', {
        body: {
          text: value,
          jobTitle: jobTitle
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI Response:', data);

      if (data && data.enhancedText) {
        onChange(index, data.enhancedText);

        toast({
          title: "Enhanced!",
          description: "Rewrote using professional action verbs.",
        });
      } else {
        throw new Error('No enhancement returned');
      }
    } catch (error) {
      console.error('Enhance error:', error);
      toast({
        title: "Error",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex items-start gap-2 mt-2">
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder="Describe a key responsibility or achievement"
          className="pr-10 min-h-[40px] resize-none overflow-hidden py-2 leading-relaxed"
          rows={1}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
          onClick={handleAiEnhance}
          disabled={isEnhancing}
          title="AI Magic Rewrite"
        >
          {isEnhancing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="text-gray-400 hover:text-red-500 mt-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
