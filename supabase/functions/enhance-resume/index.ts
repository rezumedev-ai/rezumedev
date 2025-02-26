
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
    console.log('Starting resume enhancement for ID:', resumeId);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) throw new Error('OpenAI API key not configured');

    // 1. Generate summary
    console.log('Generating summary...');
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
            content: 'You are a professional resume writer. Create a concise summary.'
          },
          { 
            role: 'user', 
            content: `Write a 40-word professional summary for a ${resumeData.professional_summary.title}. Focus on expertise and value. Use present tense. No metrics or years.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error('Failed to generate summary');
    const summaryData = await response.json();
    const enhancedSummary = summaryData.choices[0].message.content.trim();

    // 2. Create responsibilities
    console.log('Processing work experience...');
    const enhancedExperiences = resumeData.work_experience.map(exp => ({
      ...exp,
      responsibilities: [
        "Led key initiatives driving business growth and operational efficiency",
        "Collaborated with cross-functional teams to deliver high-impact solutions",
        "Managed projects and resources to achieve strategic objectives"
      ]
    }));

    // 3. Set skills
    const skills = {
      hard_skills: [
        "Project Management",
        "Strategic Planning",
        "Process Optimization",
        "Team Leadership",
        "Data Analysis",
        "Technical Excellence"
      ],
      soft_skills: [
        "Communication",
        "Leadership",
        "Problem Solving",
        "Team Collaboration"
      ]
    };

    // 4. Update resume
    console.log('Updating database...');
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

    console.log('Resume enhancement completed successfully');
    
    return new Response(
      JSON.stringify({ 
        message: 'Resume enhanced successfully',
        status: 'success'
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhance-resume function:', error);
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
