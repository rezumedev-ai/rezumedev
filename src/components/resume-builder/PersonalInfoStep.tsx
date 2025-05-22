
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

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
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(localStorage.getItem('selectedProfileId'));
  
  // Fetch all user profiles
  const { data: profiles } = useQuery({
    queryKey: ['resumeProfiles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching resume profiles:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!user
  });
  
  // When profile changes, update the form data
  useEffect(() => {
    if (selectedProfileId && profiles) {
      const selectedProfile = profiles.find(p => p.id === selectedProfileId);
      if (selectedProfile && selectedProfile.personal_info) {
        // Update form fields from the selected profile
        Object.entries(selectedProfile.personal_info).forEach(([key, value]) => {
          if (typeof value === 'string') {
            onChange(key, value);
          }
        });
      }
    }
  }, [selectedProfileId, profiles, onChange]);
  
  const handleProfileChange = (value: string) => {
    setSelectedProfileId(value);
    localStorage.setItem('selectedProfileId', value);
  };

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
  
  // Update profile information
  const handleSaveToProfile = async () => {
    if (!user || !selectedProfileId) return;
    
    try {
      const { error } = await supabase
        .from("resume_profiles")
        .update({
          personal_info: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            linkedin: formData.linkedin,
            website: formData.website
          }
        })
        .eq("id", selectedProfileId)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      console.error("Error saving profile information:", error);
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive",
      });
    }
  };

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "linkedin", label: "LinkedIn Profile", type: "url", required: false },
    { name: "website", label: "Portfolio/Website", type: "url", required: false }
  ];

  return (
    <div className="space-y-4">
      {user && profiles && profiles.length > 0 && (
        <div className="space-y-2 mb-6">
          <Label>Select Profile</Label>
          <Select 
            value={selectedProfileId || undefined} 
            onValueChange={handleProfileChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name} {profile.is_default ? "(Default)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
      
      {user && selectedProfileId && (
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={handleSaveToProfile}
          >
            Save changes to profile
          </Button>
          
          <div className="flex items-center space-x-2 pt-2 text-sm text-gray-600">
            <span>This will update the selected profile with these changes</span>
          </div>
        </div>
      )}
      
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
