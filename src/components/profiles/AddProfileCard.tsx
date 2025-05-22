
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

interface AddProfileCardProps {
  onClick: () => void;
}

export function AddProfileCard({ onClick }: AddProfileCardProps) {
  return (
    <motion.div
      className="cursor-pointer rounded-lg overflow-hidden transition-all duration-300
                flex flex-col items-center justify-center
                w-full aspect-square mx-auto
                border-2 border-dashed border-primary/30 hover:border-primary
                bg-accent/10 hover:bg-accent/20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 p-2">
        <PlusCircle className="w-12 h-12 sm:w-16 sm:h-16 text-primary/70" />
        <h3 className="font-medium text-sm sm:text-base text-center text-primary">Add Profile</h3>
      </div>
    </motion.div>
  );
}
