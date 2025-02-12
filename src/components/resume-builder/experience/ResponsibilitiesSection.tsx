
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResponsibilitiesSectionProps {
  jobTitle: string;
  responsibilities: string[];
  onUpdate: (responsibilities: string[]) => void;
}

export function ResponsibilitiesSection({ jobTitle, responsibilities, onUpdate }: ResponsibilitiesSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const addResponsibility = () => {
    onUpdate([...responsibilities, ""]);
  };

  const updateResponsibility = (index: number, value: string) => {
    const updated = responsibilities.map((resp, i) => (i === index ? value : resp));
    onUpdate(updated);
  };

  const removeResponsibility = (index: number) => {
    onUpdate(responsibilities.filter((_, i) => i !== index));
  };

  const generateResponsibilities = async () => {
    if (!jobTitle) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title first to generate relevant responsibilities.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('resume-suggestions', {
        body: { type: 'responsibilities', jobTitle }
      });

      if (error) throw error;

      const generatedResponsibilities = JSON.parse(data.suggestion);
      onUpdate(generatedResponsibilities);
      
      toast({
        title: "Responsibilities Generated",
        description: "Review and customize the suggested responsibilities to match your experience.",
      });
    } catch (error) {
      console.error('Error generating responsibilities:', error);
      toast({
        title: "Error",
        description: "Failed to generate responsibilities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Key Responsibilities <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateResponsibilities}
            disabled={isGenerating}
            className="text-xs"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {isGenerating ? "Generating..." : "Suggest Responsibilities"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addResponsibility}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Responsibility
          </Button>
        </div>
      </div>

      {responsibilities.map((resp, index) => (
        <div key={index} className="flex gap-2">
          <Textarea
            value={resp}
            onChange={(e) => updateResponsibility(index, e.target.value)}
            placeholder="e.g. Led a team of 5 developers in developing a new feature"
            className="flex-1"
          />
          {responsibilities.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeResponsibility(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
