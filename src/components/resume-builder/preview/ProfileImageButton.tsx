
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Camera, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { ImageUploadButton } from "./ImageUploadButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        >
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Photo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl bg-white border shadow-lg">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b">
          <DialogTitle className="text-sm font-semibold text-primary">Profile Photo</DialogTitle>
          <DialogDescription className="text-xs text-gray-600 mt-1">
            Add a professional photo to your resume
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 bg-white">
          <div className="flex justify-center mb-6">
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
                <div 
                  className={cn(
                    "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                    "flex items-center justify-center bg-black/50"
                  )}
                >
                  <div className="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/60">
                    Change photo
                  </div>
                </div>
              </div>
            ) : (
              <div className="transition-all hover:scale-105 cursor-pointer animate-fade-in">
                <Avatar className="w-36 h-36 border-2 border-dashed border-gray-300 bg-gray-50/70 shadow-sm">
                  <AvatarFallback className="text-xl text-gray-400 flex flex-col items-center justify-center bg-gray-50">
                    <Camera className="w-10 h-10 mb-2 opacity-40" />
                    <span className="text-xs">Add photo</span>
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 text-center mb-5 px-4 py-2 bg-gray-50 rounded-lg">
            {currentImageUrl 
              ? "A professional photo helps create a personal connection" 
              : "Recommended size: 400x400 pixels (max 2MB)"}
          </div>
          
          <div className="flex justify-center mt-3">
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
      </DialogContent>
    </Dialog>
  );
}
