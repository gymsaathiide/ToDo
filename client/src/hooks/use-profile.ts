import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function useProfile() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const hasCreatedProfile = useRef(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const { data: profile, isLoading, error, refetch } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && !!user?.id && !isCreatingProfile,
    staleTime: 30000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { full_name?: string; avatar_url?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const supabase = await getSupabase();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const createProfile = useCallback(async () => {
    if (!user?.id || hasCreatedProfile.current || isCreatingProfile) return;
    
    hasCreatedProfile.current = true;
    setIsCreatingProfile(true);
    
    try {
      const supabase = await getSupabase();
      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (existingProfile) {
        setIsCreatingProfile(false);
        return;
      }
      
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || null;
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
        });
      
      if (error && error.code !== '23505') {
        console.error('Error creating profile:', error);
      }
      
      await refetch();
    } catch (err) {
      console.error('Error in profile creation:', err);
    } finally {
      setIsCreatingProfile(false);
    }
  }, [user?.id, refetch, isCreatingProfile]);

  useEffect(() => {
    if (isAuthenticated && user?.id && !isLoading && profile === null && !hasCreatedProfile.current) {
      createProfile();
    }
  }, [isAuthenticated, user?.id, isLoading, profile, createProfile]);

  useEffect(() => {
    if (!isAuthenticated) {
      hasCreatedProfile.current = false;
    }
  }, [isAuthenticated]);

  return {
    profile,
    isLoading: isLoading || isCreatingProfile,
    error,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
}
