
import { Input } from "@/components/ui/input";

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "linkedin", label: "LinkedIn Profile", type: "url", required: false },
    { name: "website", label: "Portfolio/Website", type: "url", required: false }
  ];

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type={field.type}
            value={formData[field.name as keyof typeof formData] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
