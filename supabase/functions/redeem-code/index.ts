
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!;
    
    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Authentication failed');
    }
    
    // Get the code from the request
    const { code } = await req.json();
    
    if (!code) {
      throw new Error('Redemption code is required');
    }
    
    console.log(`User ${user.id} is trying to redeem code: ${code}`);
    
    // Start a database transaction
    const { data: codeData, error: codeError } = await supabase
      .from('redemption_codes')
      .select('*')
      .eq('code', code)
      .eq('is_redeemed', false)
      .single();
    
    if (codeError || !codeData) {
      throw new Error('Invalid or already redeemed code');
    }
    
    // Mark the code as redeemed
    const { error: updateError } = await supabase
      .from('redemption_codes')
      .update({
        is_redeemed: true,
        redeemed_by: user.id,
        redeemed_at: new Date().toISOString()
      })
      .eq('id', codeData.id);
    
    if (updateError) {
      throw new Error('Failed to redeem code');
    }
    
    // Update the user's profile to have lifetime access
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: 'lifetime',
        subscription_end_date: null // null signifies no end date (i.e., lifetime)
      })
      .eq('id', user.id);
    
    if (profileError) {
      throw new Error('Failed to update subscription status');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Code redeemed successfully. You now have lifetime access!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error redeeming code:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
