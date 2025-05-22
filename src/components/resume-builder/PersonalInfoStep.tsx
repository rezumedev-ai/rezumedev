
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  onChange: (field: string, value: string) => void;
  useProfileData?: boolean;
}

export function PersonalInfoStep({ formData, onChange, useProfileData = false }: PersonalInfoStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  
  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "linkedin", label: "LinkedIn Profile", type: "url", required: false },
    { name: "website", label: "Portfolio/Website", type: "url", required: false }
  ];

  const handleSaveAsDefault = async () => {
    if (!user || !saveAsDefault) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          linkedin_url: formData.linkedin,
          website_url: formData.website
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Information saved",
        description: "Your default resume information has been updated",
      });
    } catch (error) {
      console.error("Error saving default information:", error);
      toast({
        title: "Error",
        description: "Failed to save your default information",
        variant: "destructive",
      });
    }
  };

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
      
      {user && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="saveAsDefault"
            checked={saveAsDefault}
            onCheckedChange={(checked) => {
              setSaveAsDefault(checked === true);
              if (checked) handleSaveAsDefault();
            }}
          />
          <Label 
            htmlFor="saveAsDefault"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Save as default for future resumes
          </Label>
        </div>
      )}
    </div>
  );
}
