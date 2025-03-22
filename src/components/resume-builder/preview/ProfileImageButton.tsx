
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { ImageUploadButton } from "./ImageUploadButton";

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
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">Profile Photo</div>
          <div className="flex justify-center">
            {currentImageUrl && (
              <div className="relative w-24 h-24 mb-3">
                <img 
                  src={currentImageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            )}
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
