
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPTS = {
  summary: `You are an expert resume writer specializing in ATS optimization. Create concise, impactful summaries that:
- Are 3-4 lines maximum
- Include relevant industry keywords
- Highlight key strengths and value proposition
- Maintain professional, third-person tone
- Focus on measurable achievements`,

  experience: `You are an expert resume writer. Transform job responsibilities into achievement-focused bullet points that:
- Start with strong action verbs
- Include metrics and specific outcomes
- Are 1-2 lines maximum per bullet
- Use industry-specific keywords
- Limit to 4-5 bullet points per role
- Focus on most impactful contributions`,

  skills: `You are an expert resume writer. Generate relevant technical and soft skills that:
- Are specific to the industry and role
- Include both technical competencies and soft skills
- Prioritize keywords commonly found in job descriptions
- Are organized by category
- Maximum 8-10 skills per category`
};

async function enhanceWithAI(content: string, systemPrompt: string, openAIApiKey: string) {
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
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content
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
    console.error('AI enhancement error:', error);
    throw error;
  }
}

async function generateSkills(jobTitle: string, experience: any[], openAIApiKey: string) {
  const experienceContext = experience
    .map(exp => `${exp.jobTitle} at ${exp.companyName}: ${exp.responsibilities.join('. ')}`)
    .join('\n');

  const prompt = `Based on this professional background for a ${jobTitle} position:\n${experienceContext}\n\nGenerate two lists:
1. Technical Skills (Hard Skills)
2. Professional Skills (Soft Skills)

Focus on skills that are most relevant to the role and mentioned in the experience.`;

  const skillsContent = await enhanceWithAI(prompt, SYSTEM_PROMPTS.skills, openAIApiKey);
  
  // Parse the skills into categories
  const hardSkills = [];
  const softSkills = [];
  let currentCategory = null;

  skillsContent.split('\n').forEach(line => {
    if (line.includes('Technical Skills') || line.includes('Hard Skills')) {
      currentCategory = 'hard';
    } else if (line.includes('Professional Skills') || line.includes('Soft Skills')) {
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
    const { resumeData, resumeId } = await req.json();
    console.log('Starting resume enhancement for ID:', resumeId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enhance professional summary
    console.log('Enhancing professional summary...');
    const summaryPrompt = `Create a professional summary for a ${resumeData.professional_summary.title} position with this background:\n${resumeData.professional_summary.summary}`;
    const enhancedSummary = await enhanceWithAI(summaryPrompt, SYSTEM_PROMPTS.summary, openAIApiKey);

    // Enhance work experience
    console.log('Enhancing work experience entries...');
    const enhancedExperience = await Promise.all(
      resumeData.work_experience.map(async (exp: any) => {
        const responsibilitiesPrompt = `Transform these job responsibilities for a ${exp.jobTitle} position into achievement-focused bullets:\n${exp.responsibilities.join('\n')}`;
        const enhancedResponsibilities = await enhanceWithAI(responsibilitiesPrompt, SYSTEM_PROMPTS.experience, openAIApiKey);
        
        return {
          ...exp,
          responsibilities: enhancedResponsibilities
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .slice(0, 5) // Limit to 5 bullet points per role
        };
      })
    );

    // Generate optimized skills
    console.log('Generating optimized skills...');
    const enhancedSkills = await generateSkills(
      resumeData.professional_summary.title,
      enhancedExperience,
      openAIApiKey
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
        skills: enhancedSkills,
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
