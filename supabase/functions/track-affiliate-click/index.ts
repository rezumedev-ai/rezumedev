
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { code, referrer } = await req.json()
    
    // Generate a unique cookie ID
    const cookieId = crypto.randomUUID()
    
    // Get the affiliate link details
    const { data: linkData, error: linkError } = await supabaseClient
      .from('affiliate_links')
      .select('id, affiliate_id')
      .eq('code', code)
      .single()

    if (linkError || !linkData) {
      throw new Error('Invalid affiliate link')
    }

    // Record the click
    const { error: clickError } = await supabaseClient
      .from('affiliate_clicks')
      .insert({
        link_id: linkData.id,
        visitor_ip: req.headers.get('x-forwarded-for') || null,
        referrer: referrer || null,
        user_agent: req.headers.get('user-agent') || null,
        cookie_id: cookieId
      })

    if (clickError) {
      throw clickError
    }

    return new Response(
      JSON.stringify({ cookieId }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': `aff_id=${cookieId}; path=/; max-age=2592000; SameSite=Lax` // 30 days
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
