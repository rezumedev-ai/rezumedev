
import { useState } from 'react';
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

  // Set selected profile to default if available
  const defaultProfile = profiles.find(p => p.is_default);
  
  if (!selectedProfileId && defaultProfile && !isLoading) {
    setSelectedProfileId(defaultProfile.id);
  }

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
      createProfile(profileData);
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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <SimplifiedHeader />
      
      <motion.div 
        className="max-w-5xl mx-auto pt-20 pb-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-white">
            Who's creating a resume?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select a profile or create a new one to get started
          </p>
        </motion.div>

        <div className="flex justify-end mb-6">
          <Button
            variant={isEditing ? "default" : "outline"}
            className={`transition-all ${isEditing ? "bg-green-500 hover:bg-green-600" : "bg-transparent"}`}
            onClick={handleToggleEditing}
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

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {profiles.map((profile) => (
              <motion.div key={profile.id} variants={itemVariants}>
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
              <motion.div variants={itemVariants}>
                <AddProfileCard onClick={handleAddProfile} />
              </motion.div>
            )}
          </motion.div>
        )}

        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={handleCreateResume}
            className="min-w-[200px] py-6 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            disabled={!selectedProfileId}
          >
            Create Resume
          </Button>
        </motion.div>
      </motion.div>

      <ProfileDialog
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        onSave={handleSaveProfile}
        existingProfile={profileToEdit}
        isDefault={profiles.length === 0}
      />
    </main>
  );
}
