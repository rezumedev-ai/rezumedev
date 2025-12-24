
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponsibilityInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function ResponsibilityInput({
  value,
  index,
  onChange,
  onRemove
}: ResponsibilityInputProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

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

    // Simulate AI API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // specific rewrite logic simulation
      let enhanced = value;
      // Simple mock logic to demonstrate "AI" improvement
      if (!value.includes("successfully")) enhanced = "Successfully " + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
      if (!value.includes("resulted in") && !enhanced.includes("resulted in")) {
        if (enhanced.endsWith('.')) enhanced = enhanced.slice(0, -1);
        enhanced += ", which resulted in significant operational improvements.";
      }

      onChange(index, enhanced);

      toast({
        title: "Enhanced!",
        description: "Rewrote using professional action verbs.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance text.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder="Describe a key responsibility or achievement"
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
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
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
