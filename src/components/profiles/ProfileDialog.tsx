
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
import {
  User, Mail, Phone, Linkedin, MapPin, Briefcase, Check, ChevronsUpDown, Globe
} from 'lucide-react';
import { countries } from '@/data/countries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  // Form State
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [openCountry, setOpenCountry] = useState(false);

  // Reset form when dialog opens/closes or profile changes
  useEffect(() => {
    if (existingProfile) {
      setFullName(existingProfile.personal_info.fullName || '');
      setJobTitle(existingProfile.personal_info.jobTitle || '');
      setEmail(existingProfile.personal_info.email || '');
      setPhone(existingProfile.personal_info.phone || '');
      setCountry(existingProfile.personal_info.country || '');
      setCity(existingProfile.personal_info.city || '');
      setLinkedin(existingProfile.personal_info.linkedin || '');
      setWebsite(existingProfile.personal_info.website || '');
    } else {
      setFullName('');
      setJobTitle('');
      setEmail('');
      setPhone('');
      setCountry('');
      setCity('');
      setLinkedin('');
      setWebsite('');
    }
  }, [existingProfile, isOpen]);

  // Auto-fill phone code when country changes
  const handleCountrySelect = (currentValue: string) => {
    setCountry(currentValue);
    setOpenCountry(false);

    // Only set phone code if phone is empty or just has a different code
    const selectedCountry = countries.find(c => c.name === currentValue);
    if (selectedCountry && (!phone || phone.length < 5)) {
      setPhone(selectedCountry.code + ' ');
    }
  };

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
        jobTitle,
        email,
        phone,
        country,
        city,
        linkedin,
        website
      },
      is_default: false
    };

    onSave(profileData);
  };

  const initials = getInitials(fullName);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white border border-gray-100 shadow-2xl">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 pb-8 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {existingProfile ? 'Edit Profile' : 'Create Profile'}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-base">
              {existingProfile
                ? 'Update your professional details below'
                : 'Let\'s get your professional identity set up'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-6 mt-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarFallback className="text-3xl font-bold bg-primary text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-semibold text-xs text-primary uppercase tracking-wider">Preview</div>
              <div className="text-xl font-bold text-gray-900">{fullName || 'Your Name'}</div>
              <div className="text-sm font-medium text-gray-500">{jobTitle || 'Your Job Title'}</div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <ScrollArea className="flex-1 p-6 max-h-[60vh] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Personal Details Group */}
            <div className="col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-bold text-gray-500 uppercase">Full Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-xs font-bold text-gray-500 uppercase">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Software Engineer"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Group */}
            <div className="col-span-2 space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-xs font-bold text-gray-500 uppercase mb-2">Country</Label>
                  <Popover open={openCountry} onOpenChange={setOpenCountry} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCountry}
                        className="w-full justify-between pl-3 text-left font-normal border-gray-200 bg-gray-50/50 hover:bg-white"
                      >
                        {country ? (
                          <span className="flex items-center gap-2 truncate">
                            <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                            {country}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                            Select Country
                          </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 z-[9999]" align="start">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((c) => (
                              <CommandItem
                                key={c.name}
                                value={c.name}
                                onSelect={(currentValue) => {
                                  handleCountrySelect(currentValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country === c.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-bold text-gray-500 uppercase">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York, NY"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Group */}
            <div className="col-span-2 space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> Contact & Socials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-xs font-bold text-gray-500 uppercase">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/john"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-bold text-gray-500 uppercase">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="yourportfolio.com"
                      className="pl-9 bg-gray-50/50 focus:bg-white transition-all border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white min-w-[140px] shadow-lg shadow-primary/20"
          >
            {existingProfile ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
