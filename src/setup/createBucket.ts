
import { supabase } from "@/integrations/supabase/client";

export async function createAvatarsBucket() {
  const { data, error } = await supabase.storage.getBucket('avatars');
  
  if (error && error.message.includes('does not exist')) {
    // Create bucket if it doesn't exist
    return supabase.storage.createBucket('avatars', {
      public: true
    });
  }
  
  return { data, error };
}
