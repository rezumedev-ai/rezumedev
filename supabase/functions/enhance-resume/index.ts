
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { resumeData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('Missing OpenAI API key');
      throw new Error('Missing OpenAI API key');
    }
    
    if (!resumeData?.id || !resumeData?.professional_summary?.title) {
      console.error('Invalid resume data:', resumeData);
      throw new Error('Invalid resume data');
    }

    console.log('Enhancing resume:', resumeData.id);

    const systemPrompt = `You are an expert resume writer and career counselor. Your task is to enhance the resume.
    You MUST respond with a valid JSON object containing EXACTLY these fields:
    {
      "professional_summary": "string containing the summary",
      "skills": {
        "hard_skills": ["array", "of", "hard", "skills"],
        "soft_skills": ["array", "of", "soft", "skills"]
      },
      "enhanced_work_experience": [
        {
          "responsibilities": ["array", "of", "enhanced", "responsibilities"]
        }
      ]
    }
    
    Use the candidate's work history, education, and desired role to:
    1. Create a compelling professional summary
    2. Identify relevant hard and soft skills
    3. Enhance job responsibilities to be more impactful and ATS-friendly
    4. Ensure all content is optimized for ATS systems`;

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
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: JSON.stringify({
              desired_role: resumeData.professional_summary.title,
              work_experience: resumeData.work_experience,
              education: resumeData.education,
              certifications: resumeData.certifications
            })
          }
        ],
        temperature: 0.5, // Lower temperature for more consistent JSON output
        response_format: { type: "json_object" }, // Explicitly request JSON response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Raw AI response:', data); // Log the raw response

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid AI response structure:', data);
      throw new Error('Invalid AI response structure');
    }

    let suggestions;
    try {
      const content = data.choices[0].message.content;
      console.log('AI response content:', content); // Log the content before parsing
      suggestions = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Validate the required structure
      if (!suggestions.professional_summary || !suggestions.skills || !suggestions.enhanced_work_experience) {
        throw new Error('Missing required fields in AI response');
      }
      
      console.log('Successfully parsed AI suggestions:', suggestions);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response content:', data.choices[0].message.content);
      throw new Error(`Invalid JSON response from AI: ${error.message}`);
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabaseClient
      .from('resumes')
      .update({
        professional_summary: {
          title: resumeData.professional_summary.title,
          summary: suggestions.professional_summary
        },
        skills: suggestions.skills,
        work_experience: resumeData.work_experience.map((exp: any, idx: number) => ({
          ...exp,
          responsibilities: suggestions.enhanced_work_experience[idx]?.responsibilities || exp.responsibilities || []
        })),
        completion_status: 'completed',
      })
      .eq('id', resumeData.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('Resume enhanced successfully:', resumeData.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
