
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

    // Enhanced system prompt to compensate for the mini model
    const systemPrompt = `You are an expert ATS resume optimizer and professional resume writer with extensive experience in creating high-impact, keyword-optimized resumes that pass ATS systems and impress hiring managers. Focus on:
    1. Strong action verbs
    2. Measurable achievements
    3. Industry-specific keywords
    4. Clear, concise language
    5. ATS-friendly formatting`;

    // First, enhance the professional summary
    const summaryPrompt = `Create a powerful, ATS-optimized professional summary for a ${resumeData.professional_summary.title} position.
    
    Current Information:
    - Summary: ${resumeData.professional_summary.summary}
    - Experience: ${JSON.stringify(resumeData.work_experience)}
    - Education: ${JSON.stringify(resumeData.education)}
    - Skills: ${JSON.stringify(resumeData.skills)}
    
    Requirements:
    1. Include relevant keywords for ${resumeData.professional_summary.title} role
    2. Write 3-4 impactful sentences
    3. Highlight key achievements
    4. Use industry terminology
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content;

    // Now enhance work experience bullet points
    const experiencePrompts = resumeData.work_experience.map(async (exp) => {
      const expPrompt = `Transform these job responsibilities into powerful, ATS-optimized bullet points for a ${exp.jobTitle} role at ${exp.companyName}:
      
      Current responsibilities: ${JSON.stringify(exp.responsibilities)}
      
      Requirements:
      1. Begin each with powerful action verbs
      2. Include specific metrics and achievements
      3. Use relevant keywords for ${exp.jobTitle}
      4. Focus on results and impact
      5. Keep each bullet clear and concise
      
      Format: Return exactly 4-6 bullet points, one per line.`;

      const expResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: expPrompt }
          ],
          temperature: 0.7,
        }),
      });

      const expData = await expResponse.json();
      const enhancedBullets = expData.choices[0].message.content
        .split('\n')
        .map(bullet => bullet.trim())
        .filter(bullet => bullet.length > 0 && !bullet.startsWith('-'))
        .slice(0, 6);

      return {
        ...exp,
        responsibilities: enhancedBullets
      };
    });

    const enhancedExperience = await Promise.all(experiencePrompts);

    // Extract and enhance skills
    const skillsPrompt = `Create an optimized skills section for a ${resumeData.professional_summary.title} role.
    
    Current Information:
    - Job Title: ${resumeData.professional_summary.title}
    - Experience: ${JSON.stringify(resumeData.work_experience)}
    - Current Skills: ${JSON.stringify(resumeData.skills)}
    
    Requirements:
    1. List most relevant hard and soft skills
    2. Include industry-specific technical skills
    3. Focus on in-demand skills for the role
    4. Ensure ATS-friendly formatting
    
    Return in JSON format:
    {
      "hard_skills": ["skill1", "skill2", ...],
      "soft_skills": ["skill1", "skill2", ...]
    }
    
    Include exactly 10 skills in each category.`;

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
