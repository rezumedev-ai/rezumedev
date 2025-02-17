
import { Plus, Pencil, Trash2, FileText, Eye, Download, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
  completion_status: string;
  current_step: number;
  professional_summary: {
    title: string;
  };
}

interface ResumeListProps {
  resumes: Resume[];
  onCreateNew: () => void;
}

export function ResumeList({ resumes, onCreateNew }: ResumeListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

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
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Resume deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/resume-builder/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/resume-preview/${id}`);
  };

  const handleDownload = (id: string) => {
    navigate(`/resume-preview/${id}`);
  };

  const startEditingTitle = (resume: Resume) => {
    setEditingId(resume.id);
    setEditTitle(resume.title || resume.professional_summary?.title || "Untitled");
  };

  const saveTitle = async (id: string) => {
    const { error } = await supabase
      .from('resumes')
      .update({ title: editTitle })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not update resume title",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Resume title updated",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
    setEditingId(null);
  };

  const handleCreateNew = () => {
    navigate("/new-resume");
  };

  return (
    <div className="space-y-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Resumes</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600">Craft your professional story with our intelligent resume builder</p>
        </div>
        <Button 
          onClick={handleCreateNew} 
          className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/25 w-full sm:w-auto group"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume, index) => (
          <Card 
            key={resume.id} 
            className="group p-6 hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm border border-gray-200/50 animate-fade-up hover:border-primary/20"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                  <FileText className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
                </div>
                <div className={cn(
                  "text-xs px-3 py-1 rounded-full transition-colors duration-300",
                  resume.completion_status === 'completed' 
                    ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                    : "bg-amber-100 text-amber-800 group-hover:bg-amber-200"
                )}>
                  {resume.completion_status === 'completed' ? 'Completed' : `Step ${resume.current_step} of 7`}
                </div>
              </div>

              <div>
                {editingId === resume.id ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 border-primary/20 focus:border-primary/40"
                      placeholder="Enter resume title"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => saveTitle(resume.id)}
                      className="hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="hover:bg-red-50"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 break-words group-hover:text-primary/90 transition-colors">
                      {resume.title || resume.professional_summary?.title || "Untitled"}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => startEditingTitle(resume)}
                      className="p-0 h-auto hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Updated {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(resume.id)}
                  className="group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <Pencil className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleView(resume.id)}
                  className="group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(resume.id)}
                  className="group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(resume.id)}
                  className="group/btn hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <Card 
          className="group p-6 border-dashed hover:border-primary/50 transition-all duration-500 cursor-pointer bg-white/50 backdrop-blur-sm animate-fade-up hover:shadow-lg"
          onClick={handleCreateNew}
          style={{ animationDelay: `${(resumes.length + 3) * 100}ms` }}
        >
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 text-primary/60" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium text-lg">Create New Resume</p>
              <p className="text-sm text-gray-500">Start building your professional story</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
