
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function makeOpenAIRequest(prompt: string, systemRole: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemRole },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenAI API');
  }

  return data.choices[0].message.content.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    console.log('Starting resume enhancement for:', resumeId);

    // Generate professional summary
    console.log('Generating professional summary...');
    const summaryPrompt = `
      Create a brief, powerful professional summary for a ${resumeData.professional_summary.title} position.
      Requirements:
      - Maximum 2-3 concise sentences
      - Focus on value proposition and expertise
      - Include relevant industry keywords
      - Must be ATS-optimized
      - DO NOT mention years of experience or specific metrics
      - Keep it under 50 words for perfect A4 fit
      - Use present tense
      - Be direct and impactful
      
      Format: Return only the polished summary text.
    `;

    const enhancedSummary = await makeOpenAIRequest(
      summaryPrompt,
      'You are a professional resume writer who creates concise, powerful content.'
    );

    // Generate responsibilities for each work experience
    console.log('Generating work experience bullet points...');
    const enhancedExperiences = await Promise.all(resumeData.work_experience.map(async (exp: any, index: number) => {
      console.log(`Processing experience ${index + 1}:`, exp.jobTitle);
      const responsibilitiesPrompt = `
        Create exactly 3 powerful, ATS-optimized bullet points for a ${exp.jobTitle} position.
        Requirements:
        - Exactly 3 bullet points
        - Each bullet must be under 120 characters
        - Start each with a strong action verb
        - Include relevant industry keywords
        - Focus on achievements and impact
        - Be specific but avoid mentioning exact numbers/percentages
        - Ensure perfect formatting for A4 resume
        - Remove any bullet points or dashes at the start
        
        Format: Return exactly 3 lines, one point per line.
      `;

      const responsibilitiesContent = await makeOpenAIRequest(
        responsibilitiesPrompt,
        'You are a resume expert who creates concise, impactful bullet points.'
      );

      const responsibilities = responsibilitiesContent
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3) // Ensure exactly 3 points
        .map(line => line.replace(/^[•\-\d.]\s*/, '')); // Remove any bullets or numbers

      return {
        ...exp,
        responsibilities
      };
    }));

    // Generate relevant skills
    console.log('Generating skills...');
    const skillsPrompt = `
      Create two concise, professional skill lists for a ${resumeData.professional_summary.title} position.
      
      Requirements:
      - Technical Skills: List exactly 6 most relevant technical skills
      - Professional Skills: List exactly 4 most relevant soft skills
      - Skills must be single words or short phrases
      - Order by importance
      - Ensure all skills are highly relevant to the role
      - Include only current, in-demand skills
      
      Format: Return as a JSON object with this exact structure:
      {
        "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
        "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
      }
    `;

    const skillsContent = await makeOpenAIRequest(
      skillsPrompt,
      'You are a technical recruiter who understands modern skill requirements.'
    );

    let enhancedSkills;
    try {
      enhancedSkills = JSON.parse(skillsContent);
      
      // Validate skills structure
      if (!Array.isArray(enhancedSkills.hard_skills) || !Array.isArray(enhancedSkills.soft_skills) ||
          enhancedSkills.hard_skills.length !== 6 || enhancedSkills.soft_skills.length !== 4) {
        throw new Error('Invalid skills format');
      }
    } catch (error) {
      console.error('Error parsing skills:', error);
      // Fallback to manual parsing if JSON fails
      const lines = skillsContent.split('\n').filter(line => line.trim());
      enhancedSkills = {
        hard_skills: lines.slice(0, 6).map(s => s.replace(/^[•\-]\s*/, '')),
        soft_skills: lines.slice(6, 10).map(s => s.replace(/^[•\-]\s*/, ''))
      };
    }

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
    console.log('Updating resume in database...');
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
      console.error('Database update error:', updateError);
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
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
