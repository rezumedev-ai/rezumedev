
import { useState } from 'react';
import { ResumeProfile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Trash2 } from 'lucide-react';
import { getInitials } from '@/utils/format-names';

interface ProfileCardProps {
  profile: ResumeProfile;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCard({
  profile,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const initials = getInitials(profile.personal_info.fullName || profile.name);

  // Use the full name as the display name
  const displayName = profile.personal_info.fullName || profile.name;

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300",
        "flex flex-col items-center justify-center p-2",
        "w-full aspect-square mx-auto",
        isSelected ? "ring-4 ring-primary bg-accent/30" : "hover:ring-2 hover:ring-primary/50"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center justify-center space-y-3 w-full h-full">
        <Avatar className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-background">
          <AvatarFallback className="text-xl sm:text-2xl bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-medium text-base sm:text-lg text-center line-clamp-2 text-white px-1">
          {displayName}
        </h3>
      </div>

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <div className="w-4 h-4 bg-primary rounded-full" />
        </motion.div>
      )}

      {/* Edit button that appears on hover */}
      {isHovered && (
        <>
          <motion.div
            className="absolute top-2 right-2 cursor-pointer z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit Profile"
          >
            <div className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white hover:text-primary transition-colors shadow-sm">
              <Pencil className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-2 left-2 cursor-pointer z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.05 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Profile"
          >
            <div className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" />
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
