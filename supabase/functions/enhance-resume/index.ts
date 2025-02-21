
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData } = await req.json();
    
    if (!resumeData || !resumeData.id) {
      throw new Error('Missing required resume data or ID');
    }

    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Starting resume enhancement for ID:', resumeData.id);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enhance professional summary
    console.log('Enhancing professional summary...');
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer focused on creating ATS-friendly content.'
          },
          {
            role: 'user',
            content: `Enhance this professional summary for a ${resumeData.professional_summary.title} position:\n${resumeData.professional_summary.summary}`
          }
        ],
      }),
    });

    if (!summaryResponse.ok) {
      throw new Error('OpenAI API error: ' + await summaryResponse.text());
    }

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content;

    // Enhance work experience
    console.log('Enhancing work experience...');
    const enhancedExperience = await Promise.all(
      resumeData.work_experience.map(async (exp) => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert resume writer. Convert job responsibilities into achievement-focused, ATS-friendly bullet points.'
              },
              {
                role: 'user',
                content: `Enhance these responsibilities for a ${exp.jobTitle} role:\n${exp.responsibilities.join('\n')}`
              }
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error: ' + await response.text());
        }

        const data = await response.json();
        return {
          ...exp,
          responsibilities: data.choices[0].message.content
            .split('\n')
            .filter(line => line.trim().length > 0)
        };
      })
    );

    // Update resume in database
    console.log('Updating resume with enhanced content...');
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: {
          ...resumeData.professional_summary,
          summary: enhancedSummary
        },
        work_experience: enhancedExperience,
        completion_status: 'completed'
      })
      .eq('id', resumeData.id);

    if (updateError) {
      throw updateError;
    }

    console.log('Resume enhancement completed successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhance-resume function:', error);

    // Try to update the resume status to error
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      if (req.body) {
        const { resumeData } = await req.json();
        if (resumeData?.id) {
          await supabase
            .from('resumes')
            .update({ completion_status: 'error' })
            .eq('id', resumeData.id);
        }
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return new Response(
      JSON.stringify({
        error: 'Resume enhancement failed',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
