
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Certification {
  name: string;
  organization: string;
  completionDate: string;
}

interface CertificationsStepProps {
  formData: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export function CertificationsStep({ formData, onChange }: CertificationsStepProps) {
  const addCertification = () => {
    onChange([
      ...formData,
      {
        name: "",
        organization: "",
        completionDate: ""
      }
    ]);
  };

  const removeCertification = (index: number) => {
    onChange(formData.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = formData.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange(updatedCertifications);
  };

  return (
    <div className="space-y-6">
      {formData.map((certification, index) => (
        <Card key={index} className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
            onClick={() => removeCertification(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 text-primary">
            <Award className="w-5 h-5" />
            <h3 className="font-medium">Certification {index + 1}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Certification Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={certification.name}
                onChange={(e) => updateCertification(index, "name", e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <Input
                value={certification.organization}
                onChange={(e) => updateCertification(index, "organization", e.target.value)}
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Completion Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="month"
                value={certification.completionDate}
                onChange={(e) => updateCertification(index, "completionDate", e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={addCertification}
        variant="outline"
        className="w-full py-8 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
