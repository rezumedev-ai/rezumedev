
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Camera, Trash2 } from "lucide-react";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { ImageUploadButton } from "./ImageUploadButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileImageButtonProps {
  resumeId: string;
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
}

export function ProfileImageButton({
  resumeId,
  currentImageUrl,
  onImageUpdate
}: ProfileImageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract initials from the resume ID for the avatar fallback
  const initials = resumeId.substring(0, 2).toUpperCase();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        >
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Photo</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0 overflow-hidden rounded-xl shadow-lg">
        <div className="flex flex-col">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 border-b">
            <h3 className="text-sm font-semibold text-primary">Profile Photo</h3>
            <p className="text-xs text-gray-600 mt-1">
              Add a professional photo to your resume
            </p>
          </div>
          
          <div className="p-5">
            <div className="flex justify-center mb-5">
              {currentImageUrl ? (
                <div className="relative group animate-fade-in">
                  <Avatar className="w-36 h-36 border-2 border-gray-200 shadow-md">
                    <AvatarImage 
                      src={currentImageUrl} 
                      alt="Profile" 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">
                      Change photo
                    </div>
                  </div>
                </div>
              ) : (
                <div className="transition-all hover:scale-105 cursor-pointer hover-lift animate-fade-in">
                  <Avatar className="w-36 h-36 border-2 border-dashed border-gray-300 bg-gray-50/70">
                    <AvatarFallback className="text-xl text-gray-400 flex flex-col items-center justify-center bg-gray-50">
                      <Camera className="w-10 h-10 mb-2 opacity-40" />
                      <span className="text-xs">Add photo</span>
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 text-center mb-4 px-2">
              {currentImageUrl 
                ? "A professional photo helps create a personal connection" 
                : "Recommended size: 400x400 pixels (max 2MB)"}
            </div>
            
            <div className="flex justify-center mt-2">
              <ImageUploadButton
                resumeId={resumeId}
                currentImageUrl={currentImageUrl}
                onImageUpdate={(url) => {
                  onImageUpdate(url);
                  setIsOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
