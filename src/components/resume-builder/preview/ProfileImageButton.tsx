
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
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
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Profile Photo</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-5">
        <div className="space-y-4">
          <div className="text-sm font-medium border-b pb-2 mb-1">Profile Photo</div>
          <div className="flex justify-center">
            {currentImageUrl ? (
              <div className="relative group">
                <Avatar className="w-32 h-32 border-2 border-gray-200 shadow-sm">
                  <AvatarImage 
                    src={currentImageUrl} 
                    alt="Profile" 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Change photo</span>
                </div>
              </div>
            ) : (
              <Avatar className="w-32 h-32 border-2 border-dashed border-gray-300 bg-gray-50">
                <AvatarFallback className="text-xl text-gray-400 flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs">No photo</span>
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-2 mb-3">
            {currentImageUrl 
              ? "Your photo will appear on your resume" 
              : "Add a professional photo to your resume"}
          </div>
          
          <ImageUploadButton
            resumeId={resumeId}
            currentImageUrl={currentImageUrl}
            onImageUpdate={(url) => {
              onImageUpdate(url);
              setIsOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
