
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const enhanceText = async (prompt: string, openAIApiKey: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert ATS resume optimizer and professional writer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in enhanceText:', error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let supabase;
  let resumeId;

  try {
    const { resumeData } = await req.json();
    resumeId = resumeData.id;
    
    if (!resumeData || !resumeId) {
      throw new Error('Missing required resume data or ID');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Initialize Supabase client
    supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting enhancement for resume:', resumeId);

    // Enhance professional summary
    let enhancedSummary;
    try {
      enhancedSummary = await enhanceText(
        `Enhance this professional summary for a ${resumeData.professional_summary.title} position to be ATS-friendly: ${resumeData.professional_summary.summary}`,
        openAIApiKey
      );
    } catch (error) {
      console.error('Failed to enhance summary:', error);
      enhancedSummary = resumeData.professional_summary.summary; // Keep original if enhancement fails
    }

    // Enhance work experience
    const enhancedExperience = await Promise.all(
      resumeData.work_experience.map(async (exp) => {
        try {
          const enhancedResponsibilities = await enhanceText(
            `Enhance these job responsibilities for a ${exp.jobTitle} role to be ATS-friendly and achievement-focused: ${exp.responsibilities.join('\n')}`,
            openAIApiKey
          );

          return {
            ...exp,
            responsibilities: enhancedResponsibilities
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
          };
        } catch (error) {
          console.error('Failed to enhance experience:', error);
          return exp; // Keep original if enhancement fails
        }
      })
    );

    // Update the resume in the database
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: {
          ...resumeData.professional_summary,
          summary: enhancedSummary
        },
        work_experience: enhancedExperience,
        completion_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Resume enhanced successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhance-resume function:', error);

    // Try to update the resume status to error if we have the necessary info
    if (supabase && resumeId) {
      try {
        await supabase
          .from('resumes')
          .update({ 
            completion_status: 'error',
            updated_at: new Date().toISOString()
          })
          .eq('id', resumeId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to enhance resume',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
