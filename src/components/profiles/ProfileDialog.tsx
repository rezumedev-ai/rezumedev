
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ResumeProfile, CreateResumeProfileParams, UpdateResumeProfileParams } from '@/types/profile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/format-names';
import { useToast } from '@/hooks/use-toast';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: CreateResumeProfileParams | UpdateResumeProfileParams) => void;
  existingProfile?: ResumeProfile;
}

export function ProfileDialog({
  isOpen,
  onClose,
  onSave,
  existingProfile
}: ProfileDialogProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  
  // Reset form when dialog opens/closes or profile changes
  useEffect(() => {
    if (existingProfile) {
      setFullName(existingProfile.personal_info.fullName || '');
      setEmail(existingProfile.personal_info.email || '');
      setPhone(existingProfile.personal_info.phone || '');
      setLinkedin(existingProfile.personal_info.linkedin || '');
      setWebsite(existingProfile.personal_info.website || '');
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setWebsite('');
    }
  }, [existingProfile, isOpen]);

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
      is_default: false // No more default profiles
    };

    onSave(profileData);
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
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name<span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="transition-all focus:ring-2 focus:ring-primary/50"
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
                className="transition-all focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className="transition-all focus:ring-2 focus:ring-primary/50"
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
                className="transition-all focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Personal website URL"
                className="transition-all focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="sm:mt-0 mt-2 transition-all hover:bg-accent/80"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="sm:mt-0 mt-2 transition-all hover:scale-105"
          >
            {existingProfile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
