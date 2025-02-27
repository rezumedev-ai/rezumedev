import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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
    const { resumeData, resumeId } = await req.json();
    
    if (!resumeId) {
      throw new Error('Resume ID is required');
    }

    console.log(`Starting resume enhancement for ID: ${resumeId}`);
    
    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, update the status to enhancing
    await supabase
      .from('resumes')
      .update({ completion_status: 'enhancing' })
      .eq('id', resumeId);
    
    // Extract job title from resumeData
    const jobTitle = resumeData.professional_summary?.title || '';
    
    // Construct a comprehensive prompt for the OpenAI API
    const prompt = `
Create a professional, ATS-friendly resume for a ${jobTitle} based on the following information:

PERSONAL INFO:
${JSON.stringify(resumeData.personal_info, null, 2)}

WORK EXPERIENCE:
${JSON.stringify(resumeData.work_experience, null, 2)}

EDUCATION:
${JSON.stringify(resumeData.education, null, 2)}

CERTIFICATIONS:
${JSON.stringify(resumeData.certifications, null, 2)}

Please provide:
1. A concise professional summary (maximum 50 words) highlighting value and expertise without metrics or years.
2. For each work experience, provide exactly 3 bullet points of responsibilities that are achievement-focused and begin with strong action verbs.
3. A list of 6 hard skills and 4 soft skills relevant to the ${jobTitle} position.

Format your response as a JSON object with the following structure:
{
  "professional_summary": {
    "title": "Job Title",
    "summary": "Professional summary text here"
  },
  "work_experience": [
    {
      // Keep all original fields and just add/update responsibilities array
      "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3"]
    }
  ],
  "skills": {
    "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
    "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
  }
}
`;

    console.log('Calling OpenAI API...');
    
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
            content: 'You are a professional resume writer who specializes in creating ATS-friendly resumes for professionals targeting top-tier companies. You must strictly use only the information provided and never make assumptions.'
          },
          { 
            role: 'user', 
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }
    
    console.log('Received response from OpenAI');
    
    // Parse the AI-generated content
    let enhancedContent;
    try {
      // Try to parse JSON from the response
      enhancedContent = JSON.parse(data.choices[0].message.content.trim());
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('OpenAI response content:', data.choices[0].message.content);
      
      // Fallback: Use a default structure
      enhancedContent = {
        professional_summary: {
          title: resumeData.professional_summary?.title || '',
          summary: "Skilled professional with expertise in implementing innovative solutions and driving business growth. Focused on delivering high-quality results through collaborative teamwork and strategic thinking."
        },
        work_experience: resumeData.work_experience.map(exp => ({
          ...exp,
          responsibilities: [
            "Led key initiatives that improved operational efficiency and productivity.",
            "Collaborated with cross-functional teams to implement effective solutions.",
            "Managed resources and projects to achieve strategic business objectives."
          ]
        })),
        skills: {
          hard_skills: [
            "Project Management",
            "Strategic Planning",
            "Process Optimization",
            "Data Analysis",
            "Technical Documentation",
            "Performance Monitoring"
          ],
          soft_skills: [
            "Communication",
            "Leadership",
            "Problem Solving",
            "Team Collaboration"
          ]
        }
      };
    }
    
    // Prepare the update payload
    const updatePayload = {
      professional_summary: {
        ...resumeData.professional_summary,
        summary: enhancedContent.professional_summary.summary
      },
      skills: enhancedContent.skills,
      completion_status: 'completed'
    };
    
    // Handle work experience specially to ensure we preserve all original data
    if (enhancedContent.work_experience && Array.isArray(enhancedContent.work_experience)) {
      // Map through the original work experiences and update responsibilities
      updatePayload.work_experience = resumeData.work_experience.map((original, index) => {
        const enhanced = enhancedContent.work_experience[index];
        if (enhanced && enhanced.responsibilities) {
          return {
            ...original,
            responsibilities: enhanced.responsibilities
          };
        }
        return original;
      });
    }

    console.log('Updating resume in database...');
    
    // Update the resume in the database
    const { error: updateError } = await supabase
      .from('resumes')
      .update(updatePayload)
      .eq('id', resumeId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log('Resume enhancement completed successfully');
    
    return new Response(
      JSON.stringify({ 
        message: 'Resume enhanced successfully',
        status: 'success'
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-professional-resume function:', error);
    
    // Try to update the resume status to error
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
      console.error('Failed to update resume status:', updateError);
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
