
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
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    throw error;
  }
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
      Write a powerful one-paragraph professional summary for a ${resumeData.professional_summary.title}.
      Requirements:
      - Maximum 40 words
      - Focus on core competencies and value proposition
      - Use present tense
      - No metrics or years of experience
      - Must be ATS-friendly
      - One short paragraph only
      
      Return only the summary text.
    `;

    const enhancedSummary = await makeOpenAIRequest(
      summaryPrompt,
      'You are a professional resume writer specializing in concise, impactful summaries.'
    );

    // Generate responsibilities for each work experience
    console.log('Generating work experience bullet points...');
    const enhancedExperiences = await Promise.all(resumeData.work_experience.map(async (exp: any) => {
      const responsibilitiesPrompt = `
        Create 3 impactful bullet points for a ${exp.jobTitle} role that:
        - Start with strong action verbs
        - Are each under 100 characters
        - Focus on achievements
        - Use ATS-friendly keywords
        - Avoid specific metrics
        
        Return exactly 3 lines, one point per line.
      `;

      const content = await makeOpenAIRequest(
        responsibilitiesPrompt,
        'You are a resume expert focusing on concise achievement statements.'
      );

      return {
        ...exp,
        responsibilities: content.split('\n')
          .filter(line => line.trim())
          .slice(0, 3)
          .map(line => line.replace(/^[•\-\d.]\s*/, ''))
      };
    }));

    // Generate skills
    console.log('Generating skills...');
    const skillsPrompt = `
      List skills for a ${resumeData.professional_summary.title} position.
      First list: 6 technical skills
      Second list: 4 soft skills
      
      Format each skill as a single word or short phrase.
      Number each skill.
      
      Example format:
      Technical Skills:
      1. Skill One
      2. Skill Two
      
      Soft Skills:
      1. Skill One
      2. Skill Two
    `;

    const skillsContent = await makeOpenAIRequest(
      skillsPrompt,
      'You are a technical recruiter creating focused skill lists.'
    );

    // Parse skills with error handling
    const skillLists = skillsContent.split('\n').filter(line => line.trim());
    const hardSkills = skillLists
      .filter(line => /^\d/.test(line)) // Lines starting with numbers
      .slice(0, 6)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    const softSkills = skillLists
      .filter(line => /^\d/.test(line)) // Lines starting with numbers
      .slice(6, 10)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    const enhancedSkills = {
      hard_skills: hardSkills.length ? hardSkills : ["Problem Solving", "Project Management", "Data Analysis", "System Design", "Technical Leadership", "API Development"],
      soft_skills: softSkills.length ? softSkills : ["Leadership", "Communication", "Team Collaboration", "Strategic Thinking"]
    };

    // Update resume in database
    console.log('Updating resume in database...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        professional_summary: {
          ...resumeData.professional_summary,
          summary: enhancedSummary
        },
        work_experience: enhancedExperiences,
        skills: enhancedSkills,
        completion_status: 'completed'
      })
      .eq('id', resumeId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log('Resume enhancement completed successfully');
    return new Response(
      JSON.stringify({
        message: 'Resume enhanced successfully',
        data: {
          professional_summary: {
            ...resumeData.professional_summary,
            summary: enhancedSummary
          },
          work_experience: enhancedExperiences,
          skills: enhancedSkills
        }
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
