
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Starting resume enhancement for:', resumeId);

    // Generate professional summary
    const summaryPrompt = `
      Create a highly professional, ATS-optimized executive summary for a ${resumeData.professional_summary.title} position.
      The summary should:
      - Be 3-4 sentences long
      - Include relevant industry keywords
      - Highlight leadership and technical expertise
      - Be written in first person
      - Focus on quantifiable achievements
      - Be optimized for ATS systems
      - Be suitable for top-tier companies
      Do not make any assumptions about experience or specific achievements.
      Format: Return only the summary text without any additional context or explanations.
    `;

    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert resume writer for top technology companies.' },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content;

    // Generate responsibilities for each work experience
    const enhancedExperiences = await Promise.all(resumeData.work_experience.map(async (exp) => {
      const responsibilitiesPrompt = `
        Create 4-6 highly impactful, ATS-optimized bullet points for a ${exp.jobTitle} position at ${exp.companyName}.
        Each bullet point should:
        - Start with a strong action verb
        - Include measurable achievements and metrics where possible
        - Incorporate relevant technical keywords and skills
        - Follow the STAR (Situation, Task, Action, Result) format where applicable
        - Be optimized for applicant tracking systems
        - Be suitable for top-tier company applications
        
        Format: Return only the bullet points, one per line, without any additional context or numbering.
      `;

      const respResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert resume writer specializing in creating impactful bullet points for top technology companies.' },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.7,
        }),
      });

      const respData = await respResponse.json();
      const responsibilities = respData.choices[0].message.content
        .split('\n')
        .filter(line => line.trim().length > 0);

      return {
        ...exp,
        responsibilities
      };
    }));

    // Generate relevant skills
    const skillsPrompt = `
      Generate two lists of relevant skills for a ${resumeData.professional_summary.title} position:
      1. Technical/Hard Skills: Specific technical competencies, tools, and technologies
      2. Professional/Soft Skills: Leadership and interpersonal abilities
      
      Requirements:
      - Include 8-10 technical skills
      - Include 5-7 professional skills
      - Focus on high-demand skills for top-tier companies
      - Ensure all skills are relevant to the position
      - Include both fundamental and advanced skills
      - List skills in order of relevance
      
      Format: Return as a JSON object with two arrays: "hard_skills" and "soft_skills"
    `;

    const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert in technical recruitment and skill assessment.' },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const skillsData = await skillsResponse.json();
    const enhancedSkills = JSON.parse(skillsData.choices[0].message.content);

    // Update the resume with enhanced content
    const enhancedResume = {
      ...resumeData,
      professional_summary: {
        ...resumeData.professional_summary,
        summary: enhancedSummary
      },
      work_experience: enhancedExperiences,
      skills: enhancedSkills
    };

    // Update the resume in the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: enhancedResume.professional_summary,
        work_experience: enhancedExperiences,
        skills: enhancedSkills,
        completion_status: 'completed'
      })
      .eq('id', resumeId);

    if (updateError) {
      throw updateError;
    }

    console.log('Resume enhancement completed successfully for:', resumeId);

    return new Response(
      JSON.stringify({ 
        message: 'Resume enhanced successfully',
        data: enhancedResume 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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
