
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // First, enhance the professional summary
    const summaryPrompt = `As an expert ATS resume optimizer and professional resume writer, create a compelling and ATS-friendly professional summary for a ${resumeData.professional_summary.title} role. 
    Use the following details:
    Current summary: ${resumeData.professional_summary.summary}
    Work experience: ${JSON.stringify(resumeData.work_experience)}
    Education: ${JSON.stringify(resumeData.education)}
    Skills: ${JSON.stringify(resumeData.skills)}
    
    Requirements:
    1. Make it ATS-compliant with relevant keywords
    2. Keep it concise (3-4 sentences)
    3. Highlight key achievements and skills
    4. Incorporate industry-specific terminology
    5. Focus on value proposition
    
    Return only the enhanced summary text.`;

    // Get enhanced summary from OpenAI
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert ATS resume optimizer and professional resume writer.' },
          { role: 'user', content: summaryPrompt }
        ],
      }),
    });

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content;

    // Now enhance work experience bullet points
    const experiencePrompts = resumeData.work_experience.map(async (exp) => {
      const expPrompt = `Enhance the following job responsibilities for a ${exp.jobTitle} position at ${exp.companyName} to be more impactful and ATS-friendly:
      Current responsibilities: ${JSON.stringify(exp.responsibilities)}
      
      Requirements:
      1. Start each bullet with strong action verbs
      2. Include measurable achievements and metrics where possible
      3. Use industry-specific keywords
      4. Focus on results and impact
      5. Keep each bullet point concise
      
      Return only an array of enhanced bullet points, with 4-6 bullets maximum.`;

      const expResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert ATS resume optimizer and professional resume writer.' },
            { role: 'user', content: expPrompt }
          ],
        }),
      });

      const expData = await expResponse.json();
      const enhancedBullets = expData.choices[0].message.content
        .split('\n')
        .map(bullet => bullet.trim())
        .filter(bullet => bullet.length > 0);

      return {
        ...exp,
        responsibilities: enhancedBullets
      };
    });

    const enhancedExperience = await Promise.all(experiencePrompts);

    // Extract and enhance skills based on job title and experience
    const skillsPrompt = `Based on the following job title and experience, provide an optimized list of both technical and soft skills that would be most relevant for ATS systems:
    Job Title: ${resumeData.professional_summary.title}
    Experience: ${JSON.stringify(resumeData.work_experience)}
    Current Skills: ${JSON.stringify(resumeData.skills)}
    
    Return the response as two arrays in JSON format:
    {
      "hard_skills": ["skill1", "skill2", ...],
      "soft_skills": ["skill1", "skill2", ...]
    }
    
    Include 8-12 skills in each category, prioritizing the most relevant and in-demand skills for the role.`;

    const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert ATS resume optimizer and professional resume writer.' },
          { role: 'user', content: skillsPrompt }
        ],
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
      work_experience: enhancedExperience,
      skills: enhancedSkills,
    };

    // Save enhanced resume back to database
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: enhancedResume.professional_summary,
        work_experience: enhancedResume.work_experience,
        skills: enhancedResume.skills,
        completion_status: 'completed'
      })
      .eq('id', resumeData.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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
