
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Json } from "@/integrations/supabase/types";

export default function NewResume() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const createNewResume = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a resume",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            user_id: user.id,
            title: "Untitled Resume",
            completion_status: 'draft',
            content: {},
            personal_info: {
              fullName: '',
              email: '',
              phone: '',
              linkedin: '',
              website: ''
            } as Json,
            professional_summary: {
              title: '',
              summary: ''
            } as Json,
            work_experience: [] as Json[],
            education: [] as Json[],
            certifications: [] as Json[],
            skills: {
              hard_skills: [],
              soft_skills: []
            } as Json
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/resume-builder/${data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create new resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Create New Resume</h1>
            <p className="text-gray-600">
              Start building your professional resume with our easy-to-use builder
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={createNewResume}
              className="w-full py-6 text-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Resume
            </Button>

            <div className="text-center">
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
