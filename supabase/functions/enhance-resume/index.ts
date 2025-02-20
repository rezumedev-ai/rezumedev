
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { resumeData } = await req.json()
    
    // Wait a moment to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update the resume with enhanced content
    const { error: updateError } = await supabaseClient
      .from('resumes')
      .update({
        completion_status: 'completed',
        professional_summary: {
          ...resumeData.professional_summary,
          summary: resumeData.professional_summary.summary // In a real implementation, this would be enhanced by AI
        }
      })
      .eq('id', resumeData.id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ message: 'Resume enhanced successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
