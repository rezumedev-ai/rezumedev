
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { resumeData } = await req.json();
    
    // Validate required data
    if (!resumeData || !resumeData.id) {
      throw new Error('Missing required resume data or ID');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log('Starting enhancement for resume:', resumeData.id);

    // Enhanced system prompt
    const systemPrompt = `You are an expert ATS resume optimizer and professional resume writer. Enhance resumes to pass ATS systems and impress hiring managers. Focus on action verbs, measurable achievements, and industry keywords.`;

    // First, enhance the professional summary
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Enhance this professional summary for a ${resumeData.professional_summary.title} position:\n\n${resumeData.professional_summary.summary}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!summaryResponse.ok) {
      throw new Error('Failed to generate summary: ' + await summaryResponse.text());
    }

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content;

    // Now enhance work experience
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
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Enhance these job responsibilities for a ${exp.jobTitle} role:\n\n${exp.responsibilities.join('\n')}` }
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to enhance experience: ' + await response.text());
        }

        const data = await response.json();
        return {
          ...exp,
          responsibilities: data.choices[0].message.content.split('\n').filter(Boolean)
        };
      })
    );

    // Enhance skills
    const skillsPrompt = `Given these current skills:\n${JSON.stringify(resumeData.skills)}\n\nEnhance and organize them for a ${resumeData.professional_summary.title} role.`;
    
    const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!skillsResponse.ok) {
      throw new Error('Failed to enhance skills: ' + await skillsResponse.text());
    }

    const skillsData = await skillsResponse.json();
    const enhancedSkills = {
      hard_skills: resumeData.skills.hard_skills,
      soft_skills: resumeData.skills.soft_skills,
      ...JSON.parse(skillsData.choices[0].message.content)
    };

    // Update the resume in the database
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: {
          ...resumeData.professional_summary,
          summary: enhancedSummary
        },
        work_experience: enhancedExperience,
        skills: enhancedSkills,
        completion_status: 'completed'
      })
      .eq('id', resumeData.id);

    if (updateError) {
      console.error('Error updating resume:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Resume enhanced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
