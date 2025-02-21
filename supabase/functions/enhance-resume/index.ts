
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function enhanceWithAI(content: string, role: string, openAIApiKey: string) {
  try {
    console.log(`Enhancing content for role: ${role}`);
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
            content: 'You are an expert resume writer. Enhance the content to be more professional and ATS-friendly while maintaining truthfulness.'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { resumeData, resumeId } = await req.json();
    console.log('Starting resume enhancement for ID:', resumeId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enhance professional summary
    console.log('Enhancing professional summary...');
    const summaryPrompt = `Enhance this professional summary for a ${resumeData.professional_summary.title} position:\n${resumeData.professional_summary.summary}`;
    const enhancedSummary = await enhanceWithAI(summaryPrompt, resumeData.professional_summary.title, openAIApiKey);

    // Enhance work experience
    console.log('Enhancing work experience entries...');
    const enhancedExperience = await Promise.all(
      resumeData.work_experience.map(async (exp: any) => {
        const responsibilitiesPrompt = `Improve these job responsibilities for a ${exp.jobTitle} position to be more impactful and achievement-focused:\n${exp.responsibilities.join('\n')}`;
        const enhancedResponsibilities = await enhanceWithAI(responsibilitiesPrompt, exp.jobTitle, openAIApiKey);
        
        return {
          ...exp,
          responsibilities: enhancedResponsibilities
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
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
      .eq('id', resumeId);

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
    
    try {
      const { resumeId } = await req.json();
      if (resumeId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('resumes')
          .update({ completion_status: 'error' })
          .eq('id', resumeId);
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
