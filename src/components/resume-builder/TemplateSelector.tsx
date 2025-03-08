
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { resumeTemplates } from "./templates";
import { TemplatePreview } from "./TemplatePreview";
import { motion } from "framer-motion";

interface TemplateSelectorProps {
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeTemplates[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          Choose Your Resume Template
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select a professional template that best showcases your skills and experience
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resumeTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <TemplatePreview
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-12 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          onClick={handleContinue} 
          className="min-w-[200px] py-6 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="animate-pulse">Creating...</span>
            </motion.div>
          ) : (
            <motion.div className="flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
