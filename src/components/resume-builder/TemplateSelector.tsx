
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuizFlow } from "./QuizFlow";

interface TemplateSelectorProps {
  onTemplateSelect?: (templateId: string, style: string) => void;
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const templates = [
    {
      id: "modern-professional",
      name: "Modern Professional",
      description: "Clean and contemporary design suitable for most industries",
      preview_image_url: "https://placehold.co/600x800/4F46E5/FFFFFF/png?text=Modern+Professional"
    },
    {
      id: "creative-bold",
      name: "Creative Bold",
      description: "Eye-catching design for creative professionals",
      preview_image_url: "https://placehold.co/600x800/4338CA/FFFFFF/png?text=Creative+Bold"
    }
  ];

  const styles = [
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "brief", name: "Brief" }
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
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      // Create a new resume
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

      if (resumeError) throw resumeError;

      setResumeId(resume.id);

      // Call the onTemplateSelect prop if provided
      if (onTemplateSelect) {
        onTemplateSelect(selectedTemplate, selectedStyle);
      }

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

  const handleQuizComplete = () => {
    if (resumeId) {
      navigate(`/resume-builder/${resumeId}`);
      toast({
        title: "Resume Created",
        description: "Let's enhance your resume with AI assistance!",
      });
    }
  };

  if (resumeId) {
    return <QuizFlow resumeId={resumeId} onComplete={handleQuizComplete} />;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
              <img
                src={template.preview_image_url}
                alt={template.name}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </Card>
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
