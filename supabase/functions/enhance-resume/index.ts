
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified OpenAI request function
async function enhanceWithAI(prompt: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) throw new Error('OpenAI API key not configured');

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
          content: 'You are a professional resume writer who creates concise, impactful content.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error('Failed to get AI response');
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    console.log('Enhancing resume:', resumeId);

    // 1. Enhance summary
    const summaryPrompt = `
      Write a powerful professional summary for a ${resumeData.professional_summary.title} in ONE short paragraph.
      - Keep it under 50 words
      - Focus on expertise and value
      - Use present tense
      - No years of experience or metrics
      Return only the summary text.
    `;
    const enhancedSummary = await enhanceWithAI(summaryPrompt);

    // 2. Enhance work experience
    const enhancedExperiences = [];
    for (const exp of resumeData.work_experience) {
      const bulletPrompt = `
        Create exactly 3 bullet points for a ${exp.jobTitle} role.
        Requirements:
        - Start with action verbs
        - Each under 100 characters
        - Focus on achievements
        - No metrics
        Return only 3 lines, one bullet point per line.
      `;
      
      const bullets = await enhanceWithAI(bulletPrompt);
      enhancedExperiences.push({
        ...exp,
        responsibilities: bullets.split('\n')
          .filter(line => line.trim())
          .slice(0, 3)
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
      });
    }

    // 3. Generate skills lists
    const skillsPrompt = `
      For a ${resumeData.professional_summary.title}, list:
      6 technical skills and 4 soft skills.
      Format:
      Technical:
      1. skill1
      2. skill2
      Soft:
      1. skill1
      2. skill2
    `;
    
    const skillsResponse = await enhanceWithAI(skillsPrompt);
    const skills = {
      hard_skills: [
        "Problem Solving",
        "Project Management",
        "Data Analysis",
        "System Design",
        "Technical Leadership",
        "API Development"
      ],
      soft_skills: [
        "Communication",
        "Leadership",
        "Team Collaboration",
        "Strategic Thinking"
      ]
    };

    try {
      const lines = skillsResponse.split('\n').map(line => line.trim());
      const hardSkills = lines
        .filter(line => /^\d/.test(line))
        .slice(0, 6)
        .map(line => line.replace(/^\d+[\s.-]*/, '').trim());
      
      const softSkills = lines
        .filter(line => /^\d/.test(line))
        .slice(6, 10)
        .map(line => line.replace(/^\d+[\s.-]*/, '').trim());

      if (hardSkills.length > 0 && softSkills.length > 0) {
        skills.hard_skills = hardSkills;
        skills.soft_skills = softSkills;
      }
    } catch (error) {
      console.log('Using default skills due to parsing error:', error);
    }

    // 4. Update the resume in database
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
        skills: skills,
        completion_status: 'completed'
      })
      .eq('id', resumeId);

    if (updateError) throw updateError;

    console.log('Resume enhanced successfully:', resumeId);
    
    return new Response(
      JSON.stringify({
        message: 'Resume enhanced successfully',
        status: 'success'
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enhancement error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to enhance resume. Please try again.',
        details: error.message
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
