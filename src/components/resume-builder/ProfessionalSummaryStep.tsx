
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfessionalSummaryStepProps {
  formData: {
    title: string;
    summary: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ProfessionalSummaryStep({ formData, onChange }: ProfessionalSummaryStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const fields = [
    { name: "title", label: "Desired Job Title", type: "text", required: true },
    { 
      name: "summary", 
      label: "Professional Summary", 
      type: "textarea", 
      required: true,
      placeholder: "Write 3-4 sentences about your experience and key achievements..."
    }
  ];

  const generateSummary = async () => {
    if (!formData.title) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title first to generate a relevant summary.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('resume-suggestions', {
        body: { type: 'summary', jobTitle: formData.title }
      });

      if (error) throw error;

      onChange('summary', data.suggestion);
      toast({
        title: "Summary Generated",
        description: "Review and edit the generated summary to better match your experience.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.name === 'summary' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSummary}
                disabled={isGenerating}
                className="text-xs"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            )}
          </div>
          {field.type === 'textarea' ? (
            <Textarea
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="min-h-[100px]"
            />
          ) : (
            <Input
              type={field.type}
              value={formData[field.name as keyof typeof formData] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
