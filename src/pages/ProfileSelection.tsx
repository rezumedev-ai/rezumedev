
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
import { PencilRuler, X, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<ResumeProfile | undefined>(undefined);
  
  const {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    isCreating,
    isUpdating,
    isDeleting
  } = useResumeProfiles();

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
      // For first profile, also set as default
      const isFirst = profiles.length === 0;
      createProfile({
        ...profileData,
        is_default: isFirst ? true : profileData.is_default
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

  const handleToggleEditing = () => {
    setIsEditing(!isEditing);
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
          className="text-center mb-8 sm:mb-10"
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

        {profiles.length > 0 && (
          <div className="flex justify-end mb-6">
            <Button
              variant={isEditing ? "default" : "outline"}
              className={`transition-all ${isEditing ? "bg-green-500 hover:bg-green-600" : "bg-transparent"}`}
              onClick={handleToggleEditing}
              size="sm"
              aria-label={isEditing ? "Done editing" : "Edit profiles"}
            >
              {isEditing ? (
                <>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Done
                </>
              ) : (
                <>
                  <PencilRuler className="w-4 h-4 mr-2" />
                  Edit Profiles
                </>
              )}
            </Button>
          </div>
        )}

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
                  isEditing={isEditing}
                  onSelect={() => handleProfileSelect(profile.id)}
                  onEdit={() => handleEditProfile(profile)}
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
        isDefault={profiles.length === 0} // First profile will be default
      />
    </main>
  );
}
