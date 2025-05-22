
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ResumeProfile, CreateResumeProfileParams, UpdateResumeProfileParams } from '@/types/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getInitials } from '@/utils/format-names';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: CreateResumeProfileParams | UpdateResumeProfileParams) => void;
  existingProfile?: ResumeProfile;
  isDefault?: boolean;
}

export function ProfileDialog({
  isOpen,
  onClose,
  onSave,
  existingProfile,
  isDefault = false
}: ProfileDialogProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [makeDefault, setMakeDefault] = useState(isDefault);
  
  // Reset form when dialog opens/closes or profile changes
  useEffect(() => {
    if (existingProfile) {
      setFullName(existingProfile.personal_info.fullName || '');
      setEmail(existingProfile.personal_info.email || '');
      setPhone(existingProfile.personal_info.phone || '');
      setLinkedin(existingProfile.personal_info.linkedin || '');
      setWebsite(existingProfile.personal_info.website || '');
      setAvatarUrl(existingProfile.avatar_url || null);
      setMakeDefault(existingProfile.is_default);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setWebsite('');
      setAvatarUrl(null);
      setMakeDefault(isDefault);
    }
  }, [existingProfile, isOpen, isDefault]);

  const handleSave = () => {
    if (!fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to create a profile",
        variant: "destructive"
      });
      return;
    }

    const profileData = {
      name: fullName, // Use fullName as the profile name
      personal_info: {
        fullName,
        email,
        phone,
        linkedin,
        website
      },
      avatar_url: avatarUrl,
      is_default: makeDefault
    };

    onSave(profileData);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `profile-avatars/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(publicUrlData.publicUrl);
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile image was uploaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
  };

  const initials = getInitials(fullName);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingProfile ? 'Edit Profile' : 'Create New Profile'}</DialogTitle>
          <DialogDescription>
            {existingProfile 
              ? 'Update your profile information' 
              : 'Create a new profile for your resumes'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-muted">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Profile avatar" />
              ) : (
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex gap-2">
              <Label 
                htmlFor="avatar-upload" 
                className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload'}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </Label>
              
              {avatarUrl && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name<span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn profile URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Personal website URL"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="default-profile"
              checked={makeDefault}
              onCheckedChange={setMakeDefault}
            />
            <Label htmlFor="default-profile">Set as default profile</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="sm:mt-0 mt-2">Cancel</Button>
          <Button onClick={handleSave} className="sm:mt-0 mt-2">
            {existingProfile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
