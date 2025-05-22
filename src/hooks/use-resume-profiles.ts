
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResumeProfile, CreateResumeProfileParams, UpdateResumeProfileParams } from '@/types/profile';
import { toast } from 'sonner';

export function useResumeProfiles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all profiles for the current user
  const {
    data: profiles,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['resumeProfiles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching resume profiles:', error);
        throw error;
      }
      
      return data as ResumeProfile[];
    },
    enabled: !!user
  });

  // Fetch default profile
  const {
    data: defaultProfile,
    isLoading: isDefaultProfileLoading
  } = useQuery({
    queryKey: ['defaultResumeProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No default profile found, this is not an error
          return null;
        }
        console.error('Error fetching default profile:', error);
        throw error;
      }
      
      return data as ResumeProfile;
    },
    enabled: !!user
  });

  // Create a new profile
  const createProfileMutation = useMutation({
    mutationFn: async (profile: CreateResumeProfileParams) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .insert([{
          ...profile,
          user_id: user.id
        }])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      return data as ResumeProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeProfiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['defaultResumeProfile', user?.id] });
      toast.success('Profile created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    }
  });

  // Update an existing profile
  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, ...profile }: { id: string } & UpdateResumeProfileParams) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .update(profile)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      return data as ResumeProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeProfiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['defaultResumeProfile', user?.id] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Delete a profile
  const deleteProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('resume_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeProfiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['defaultResumeProfile', user?.id] });
      toast.success('Profile deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
    }
  });

  // Set a profile as default
  const setDefaultProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('resume_profiles')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error setting default profile:', error);
        throw error;
      }
      
      return data as ResumeProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeProfiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['defaultResumeProfile', user?.id] });
      toast.success('Default profile updated');
    },
    onError: (error) => {
      toast.error(`Failed to update default profile: ${error.message}`);
    }
  });

  // Removed createInitialProfile and its useEffect

  return {
    profiles: profiles || [],
    defaultProfile,
    isLoading,
    isDefaultProfileLoading,
    error,
    refetchProfiles: refetch,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    deleteProfile: deleteProfileMutation.mutate,
    setDefaultProfile: setDefaultProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteProfileMutation.isPending
  };
}
