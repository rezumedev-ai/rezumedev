
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { resumeTemplates } from "./templates";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateSelectorProps {
  onTemplateSelect?: (templateId: string, style: string) => void;
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeTemplates[0].id);
  const [selectedStyle, setSelectedStyle] = useState<string>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const styles = [
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" }
  ];

  const handleContinue = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a Template",
        description: "Please select a template to continue",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Creating resume with template:", selectedTemplate);

      const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .insert([
          {
            user_id: user.id,
            title: 'Untitled Resume',
            template_id: selectedTemplate,
            style_preference: selectedStyle,
            content: {},
            current_step: 1
          }
        ])
        .select()
        .single();

      if (resumeError) {
        console.error('Error creating resume:', resumeError);
        throw resumeError;
      }

      if (!resume || !resume.id) {
        throw new Error("No resume ID returned from database");
      }

      console.log("Resume created successfully:", resume.id);
      navigate(`/resume-builder/${resume.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Resume Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-medium mb-4">Resume Style</h3>
        <div className="flex flex-wrap gap-4">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant={selectedStyle === style.id ? "default" : "outline"}
              onClick={() => setSelectedStyle(style.id)}
              className="min-w-[120px]"
            >
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumeTemplates.map((template) => (
          <TemplatePreview
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => setSelectedTemplate(template.id)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleContinue} 
          className="min-w-[200px]"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Continue"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
