
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
  completion_status: string;
  current_step: number;
}

interface ResumeListProps {
  resumes: Resume[];
  onCreateNew: () => void;
}

export function ResumeList({ resumes, onCreateNew }: ResumeListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not delete resume",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/resume-builder/${id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your resumes</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{resume.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-500">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "text-xs px-2 py-1 rounded",
                  resume.completion_status === 'completed' 
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                )}>
                  {resume.completion_status === 'completed' ? 'Completed' : `Step ${resume.current_step} of 7`}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(resume.id)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(resume.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Card 
          className="p-4 md:p-6 border-dashed hover:shadow-md transition-shadow cursor-pointer" 
          onClick={onCreateNew}
        >
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Plus className="w-8 h-8" />
            <p className="font-medium">Create New Resume</p>
            <p className="text-sm text-center">Start building your professional resume</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
