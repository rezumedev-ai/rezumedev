
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
}

interface DocumentsSectionProps {
  resumes: Resume[];
}

export function DocumentsSection({ resumes }: DocumentsSectionProps) {
  const { toast } = useToast();

  const handleCreateNew = (type: string) => {
    toast({
      title: `Creating new ${type}`,
      description: "This feature will be implemented soon!",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
        </div>
        <Button onClick={() => handleCreateNew('resume')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resumes?.map((resume) => (
          <Card key={resume.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{resume.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-500">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  100% Score
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Card 
          className="p-6 border-dashed hover:shadow-md transition-shadow cursor-pointer" 
          onClick={() => handleCreateNew('resume')}
        >
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Plus className="w-8 h-8" />
            <p className="font-medium">Create New Resume</p>
            <p className="text-sm text-center">Create a tailored resume for each job application</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
