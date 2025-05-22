
import { useState } from 'react';
import { ResumeProfile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Pencil } from 'lucide-react';
import { getInitials } from '@/utils/format-names';

interface ProfileCardProps {
  profile: ResumeProfile;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProfileCard({ 
  profile, 
  isSelected,
  isEditing,
  onSelect,
  onEdit 
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const initials = getInitials(profile.personal_info.fullName || profile.name);

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300",
        "flex flex-col items-center justify-center p-2",
        "w-full max-w-[180px] aspect-square mx-auto",
        isSelected ? "ring-4 ring-primary bg-accent/30" : 
          (isEditing ? "ring-2 ring-yellow-400" : "hover:ring-2 hover:ring-primary/50"),
        isEditing ? "cursor-default" : ""
      )}
      whileHover={!isEditing ? { scale: 1.05 } : {}}
      whileTap={!isEditing ? { scale: 0.98 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isEditing ? undefined : onSelect}
    >
      <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
        <Avatar className="w-24 h-24 border-4 border-background">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
          ) : (
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>

        <h3 className="font-medium text-lg text-center line-clamp-1">
          {profile.name}
        </h3>
        
        {profile.is_default && (
          <span className="text-xs text-primary font-medium">Default</span>
        )}
      </div>

      {isSelected && !isEditing && (
        <motion.div
          className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}

      {isEditing && (
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            className="bg-white text-black p-3 rounded-full"
            onClick={onEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
