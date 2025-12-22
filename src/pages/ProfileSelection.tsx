
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeProfiles } from '@/hooks/use-resume-profiles';
import { SimplifiedHeader } from '@/components/SimplifiedHeader';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { AddProfileCard } from '@/components/profiles/AddProfileCard';
import { ProfileDialog } from '@/components/profiles/ProfileDialog';
import { ResumeProfile } from '@/types/profile';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfileSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<ResumeProfile | undefined>(undefined);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    isCreating,
    isUpdating,
    isDeleting
  } = useResumeProfiles();

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete, {
        onSuccess: () => {
          setProfileToDelete(null);
          // If the deleted profile was selected, clear selection
          if (selectedProfileId === profileToDelete) {
            setSelectedProfileId(null);
          }
        }
      });
    }
  };

  // Auto-select first profile if there is one and none is selected
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId && !isLoading) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId, isLoading]);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
  };

  const handleAddProfile = () => {
    setProfileToEdit(undefined);
    setShowProfileDialog(true);
  };

  const handleEditProfile = (profile: ResumeProfile) => {
    setProfileToEdit(profile);
    setShowProfileDialog(true);
  };

  const handleSaveProfile = (profileData: any) => {
    if (profileToEdit) {
      updateProfile({
        id: profileToEdit.id,
        ...profileData
      });
    } else {
      createProfile({
        ...profileData,
        is_default: false // Never set as default
      });
    }
    setShowProfileDialog(false);
  };

  const handleCreateResume = () => {
    if (!selectedProfileId) {
      toast.error("Please select a profile to continue");
      return;
    }

    // Save the selected profile ID to localStorage
    localStorage.setItem('selectedProfileId', selectedProfileId);

    // Navigate to template selection
    navigate('/new-resume');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Show the create profile dialog automatically if there are no profiles
  useEffect(() => {
    if (!isLoading && profiles.length === 0 && user) {
      setShowProfileDialog(true);
    }
  }, [isLoading, profiles.length, user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <SimplifiedHeader />

      <motion.div
        className="max-w-5xl mx-auto pt-16 sm:pt-20 pb-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Who's creating a resume?
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Select a profile or create a new one to get started
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {profiles.map((profile) => (
              <motion.div key={profile.id} variants={itemVariants} className="w-full">
                <ProfileCard
                  profile={profile}
                  isSelected={profile.id === selectedProfileId}
                  onSelect={() => handleProfileSelect(profile.id)}
                  onEdit={() => handleEditProfile(profile)}
                  onDelete={() => setProfileToDelete(profile.id)}
                />
              </motion.div>
            ))}

            {profiles.length < 5 && (
              <motion.div variants={itemVariants} className="w-full">
                <AddProfileCard onClick={handleAddProfile} />
              </motion.div>
            )}
          </motion.div>
        )}

        {profiles.length > 0 && (
          <motion.div
            className="mt-8 sm:mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              onClick={handleCreateResume}
              className="min-w-[200px] py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              disabled={!selectedProfileId}
            >
              Create Resume
            </Button>
          </motion.div>
        )}
      </motion.div>

      <ProfileDialog
        isOpen={showProfileDialog}
        onClose={() => {
          setShowProfileDialog(false);
          // If there are no profiles and user closes dialog, show it again
          if (profiles.length === 0) {
            setTimeout(() => setShowProfileDialog(true), 100);
          }
        }}
        onSave={handleSaveProfile}
        existingProfile={profileToEdit}
      />

      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent className="bg-white border-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently delete your profile and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-900">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Profile"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
