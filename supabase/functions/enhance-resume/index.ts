
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

  return data.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    console.log('Starting resume enhancement for:', resumeId);
    console.log('Job Title:', resumeData.professional_summary.title);

    // Generate professional summary
    console.log('Generating professional summary...');
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

    const enhancedSummary = await makeOpenAIRequest(
      summaryPrompt,
      'You are an expert resume writer for top technology companies.'
    );
    console.log('Summary generated successfully');

    // Generate responsibilities for each work experience
    console.log('Generating work experience bullet points...');
    const enhancedExperiences = await Promise.all(resumeData.work_experience.map(async (exp: any, index: number) => {
      console.log(`Processing experience ${index + 1}:`, exp.jobTitle);
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

      const responsibilitiesContent = await makeOpenAIRequest(
        responsibilitiesPrompt,
        'You are an expert resume writer specializing in creating impactful bullet points for top technology companies.'
      );

      const responsibilities = responsibilitiesContent
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•\-]\s*/, '')); // Remove any bullet points or dashes

      return {
        ...exp,
        responsibilities
      };
    }));
    console.log('Work experience bullet points generated successfully');

    // Generate relevant skills
    console.log('Generating skills...');
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
      Example format:
      {
        "hard_skills": ["Skill 1", "Skill 2"],
        "soft_skills": ["Skill 1", "Skill 2"]
      }
    `;

    const skillsContent = await makeOpenAIRequest(
      skillsPrompt,
      'You are an expert in technical recruitment and skill assessment.'
    );

    let enhancedSkills;
    try {
      enhancedSkills = JSON.parse(skillsContent.trim());
      if (!enhancedSkills.hard_skills || !enhancedSkills.soft_skills) {
        throw new Error('Invalid skills format');
      }
    } catch (error) {
      console.error('Error parsing skills JSON:', error);
      console.log('Raw skills content:', skillsContent);
      // Fallback to a simple split if JSON parsing fails
      const lines = skillsContent.split('\n').filter(line => line.trim());
      const hardSkillsStart = lines.findIndex(line => line.includes('Technical/Hard Skills'));
      const softSkillsStart = lines.findIndex(line => line.includes('Professional/Soft Skills'));
      
      enhancedSkills = {
        hard_skills: lines
          .slice(hardSkillsStart + 1, softSkillsStart)
          .filter(line => line.trim())
          .map(line => line.replace(/^[•\-]\s*/, '')),
        soft_skills: lines
          .slice(softSkillsStart + 1)
          .filter(line => line.trim())
          .map(line => line.replace(/^[•\-]\s*/, ''))
      };
    }
    console.log('Skills generated successfully');

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
