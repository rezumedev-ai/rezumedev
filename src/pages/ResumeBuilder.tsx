
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 7;

interface FormData {
  fullName: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  [key: string]: any; // Allow for dynamic fields
}

const questions = [
  {
    id: 1,
    title: "What's your full name?",
    fields: [
      { name: "fullName", type: "text", label: "Full Name", placeholder: "John Doe" }
    ]
  },
  {
    id: 2,
    title: "What's your professional title?",
    fields: [
      { name: "title", type: "text", label: "Professional Title", placeholder: "Software Engineer" }
    ]
  },
  // Add more questions as needed
];

export default function ResumeBuilder() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    title: "",
  });

  const { data: resume } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (resume) {
      setFormData(resume.builder_progress || { fullName: "", title: "" });
      setCurrentStep(resume.current_step || 1);
    }
  }, [resume]);

  const saveProgress = async () => {
    const isNew = !id;
    const { data, error } = await supabase
      .from("resumes")
      .upsert({
        id: id || undefined,
        user_id: user?.id,
        title: formData.title || "Untitled Resume",
        builder_progress: formData,
        current_step: currentStep,
        completion_status: currentStep === TOTAL_STEPS ? 'completed' : 'draft',
        content: {} // We'll populate this when the user completes all steps
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
      return null;
    }

    if (isNew && data) {
      navigate(`/resume-builder/${data.id}`, { replace: true });
    }

    queryClient.invalidateQueries({ queryKey: ["resumes"] });
    return data;
  };

  const handleNext = async () => {
    await saveProgress();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Build Your Resume</h1>
          <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />
          <p className="text-center text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-medium">{currentQuestion.title}</h2>
            <div className="space-y-4">
              {currentQuestion.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded-md"
                    value={formData[field.name] || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [field.name]: e.target.value
                    }))}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="prose max-w-none">
              <pre className="text-sm text-gray-600">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleSkip} variant="ghost">
            Skip for now
          </Button>
          <Button onClick={handleNext}>
            {currentStep === TOTAL_STEPS ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
