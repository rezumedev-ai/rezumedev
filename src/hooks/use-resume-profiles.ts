
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
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching resume profiles:', error);
        throw error;
      }
      
      return data as ResumeProfile[];
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
      toast.success('Profile deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete profile: ${error.message}`);
    }
  });

  return {
    profiles: profiles || [],
    isLoading,
    error,
    refetchProfiles: refetch,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    deleteProfile: deleteProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteProfileMutation.isPending
  };
}
