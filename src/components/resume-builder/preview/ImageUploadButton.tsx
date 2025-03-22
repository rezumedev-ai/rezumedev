
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ImageUploadButtonProps {
  resumeId: string;
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export function ImageUploadButton({
  resumeId,
  currentImageUrl,
  onImageUpdate,
  disabled = false
}: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file path using the user ID and resume ID
      const filePath = `${user.id}/${resumeId}/${file.name}`;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      // Update the resume with the new image URL
      onImageUpdate(publicUrl);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl || !user) return;

    setIsUploading(true);

    try {
      // Extract the file path from the public URL
      const urlParts = currentImageUrl.split('profile_images/');
      if (urlParts.length < 2) throw new Error("Invalid image URL");
      
      const filePath = urlParts[1];

      // Delete the file from Supabase storage
      const { error } = await supabase.storage
        .from('profile_images')
        .remove([filePath]);

      if (error) throw error;

      // Update the resume to remove the image URL
      onImageUpdate(null);
      toast.success("Profile image removed successfully");
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error("Failed to remove profile image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentImageUrl ? (
        <>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading || disabled}
            className="text-xs flex items-center gap-1.5 h-9 bg-white shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Remove</span>
          </Button>
          <label className="relative">
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isUploading || disabled}
              className="text-xs flex items-center gap-1.5 h-9 bg-white shadow-sm hover:bg-primary/5 hover:border-primary/20 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>Change</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading || disabled}
            />
          </label>
        </>
      ) : (
        <label className="relative">
          <Button
            variant="default"
            size="sm"
            type="button"
            disabled={isUploading || disabled}
            className="text-xs flex items-center gap-1.5 h-9 bg-primary hover:bg-primary/90 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
            <span>Upload Photo</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading || disabled}
          />
        </label>
      )}
    </div>
  );
}
