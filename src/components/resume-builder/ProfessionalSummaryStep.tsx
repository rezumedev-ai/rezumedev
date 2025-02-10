
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalSummaryStepProps {
  formData: {
    title: string;
    summary: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ProfessionalSummaryStep({ formData, onChange }: ProfessionalSummaryStepProps) {
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

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
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
