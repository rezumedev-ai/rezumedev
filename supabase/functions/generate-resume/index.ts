
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPTS = {
  summary: `You are an expert resume writer. Create a professional summary that:
- Is based SOLELY on the provided job title and experience
- Uses natural, professional language
- Incorporates relevant industry keywords
- Is 3-4 sentences (50-70 words)
- Highlights only demonstrable skills and experience
- Does not make assumptions about experience level
Do not fabricate or assume any details not provided in the input.`,

  responsibilities: `Generate achievement-focused bullet points that:
- Are based STRICTLY on the provided job title and company
- Start with strong action verbs
- Use specific, measurable language where possible
- Are relevant to the industry
- Maintain natural, professional tone
- Are 1-2 lines each
Do not fabricate specific metrics or achievements not provided in the input.`,

  skills: `Extract relevant skills based ONLY on:
- The stated job title
- The actual work experience provided
- Industry standards for the role
Generate two categories:
1. Technical Skills (specific to the role/industry)
2. Professional Skills (transferable skills)
DO NOT use abbreviations or short forms (e.g., use "Project Management" not "Project Mgmt")
Use complete words for all skills (e.g., "Problem Solving" not "Problem Solv")
Each skill should be written out completely with proper capitalization.
Do not include skills that aren't supported by the experience provided.`
};

async function generateWithAI(prompt: string, systemPrompt: string, openAIApiKey: string) {
  try {
    console.log('Generating content with prompt:', prompt);
    
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

async function generateProfessionalSummary(jobTitle: string, experience: any[], openAIApiKey: string) {
  const experienceContext = experience
    .map(exp => `${exp.jobTitle} at ${exp.companyName} (${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate})`)
    .join('\n');

  const prompt = `Generate a professional summary for a ${jobTitle} position based on this work history:\n${experienceContext}`;
  return await generateWithAI(prompt, SYSTEM_PROMPTS.summary, openAIApiKey);
}

async function generateResponsibilities(experience: any, openAIApiKey: string) {
  const prompt = `Generate 4-5 realistic responsibilities for a ${experience.jobTitle} position at ${experience.companyName}.`;
  const responsibilities = await generateWithAI(prompt, SYSTEM_PROMPTS.responsibilities, openAIApiKey);
  
  return responsibilities
    .split('\n')
    .map(r => r.trim())
    .filter(r => r && !r.match(/^[0-9]\.|\*/)) // Remove numbering/bullets
    .slice(0, 5); // Ensure max 5 points
}

async function generateSkills(jobTitle: string, experience: any[], openAIApiKey: string) {
  const experienceContext = experience
    .map(exp => `${exp.jobTitle} at ${exp.companyName}`)
    .join('\n');

  const prompt = `Based on this professional background for a ${jobTitle} position:\n${experienceContext}\n\nGenerate relevant technical and professional skills. DO NOT use abbreviations or shortened forms. Write out all skill names completely (e.g., "Project Management" not "Project Mgmt").`;
  const skillsContent = await generateWithAI(prompt, SYSTEM_PROMPTS.skills, openAIApiKey);
  
  const hardSkills = [];
  const softSkills = [];
  let currentCategory = null;

  skillsContent.split('\n').forEach(line => {
    if (line.toLowerCase().includes('technical') || line.toLowerCase().includes('hard skills')) {
      currentCategory = 'hard';
    } else if (line.toLowerCase().includes('professional') || line.toLowerCase().includes('soft skills')) {
      currentCategory = 'soft';
    } else if (line.trim() && currentCategory) {
      const skill = line.replace(/^[•\-\*]\s*/, '').trim();
      if (skill) {
        if (currentCategory === 'hard') {
          hardSkills.push(skill);
        } else {
          softSkills.push(skill);
        }
      }
    }
  });

  return {
    hard_skills: hardSkills.slice(0, 8),
    soft_skills: softSkills.slice(0, 6)
  };
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
    const { quizResponses, resumeId } = await req.json();
    console.log('Starting fresh resume generation for ID:', resumeId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate professional summary
    console.log('Generating professional summary...');
    const enhancedSummary = await generateProfessionalSummary(
      quizResponses.professional_summary.title,
      quizResponses.work_experience,
      openAIApiKey
    );

    // Generate responsibilities for each work experience
    console.log('Generating work experience content...');
    const enhancedExperience = await Promise.all(
      quizResponses.work_experience.map(async (exp: any) => ({
        ...exp,
        responsibilities: await generateResponsibilities(exp, openAIApiKey)
      }))
    );

    // Generate relevant skills
    console.log('Generating skills...');
    const enhancedSkills = await generateSkills(
      quizResponses.professional_summary.title,
      quizResponses.work_experience,
      openAIApiKey
    );

    // Prepare the complete resume data
    const resumeData = {
      personal_info: quizResponses.personal_info,
      professional_summary: {
        ...quizResponses.professional_summary,
        summary: enhancedSummary
      },
      work_experience: enhancedExperience,
      education: quizResponses.education,
      certifications: quizResponses.certifications || [],
      skills: enhancedSkills,
      completion_status: 'completed'
    };

    // Update resume in database
    console.log('Saving generated resume...');
    const { error: updateError } = await supabase
      .from('resumes')
      .update(resumeData)
      .eq('id', resumeId);

    if (updateError) {
      throw updateError;
    }

    console.log('Resume generation completed successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-resume function:', error);
    
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
        error: 'Resume generation failed',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
