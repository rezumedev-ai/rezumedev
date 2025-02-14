
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

    const systemPrompt = `You are an expert resume writer and career counselor. You must respond ONLY with a valid JSON object in this exact format:
{
  "professional_summary": "A compelling summary text here",
  "skills": {
    "hard_skills": ["skill1", "skill2"],
    "soft_skills": ["skill1", "skill2"]
  },
  "enhanced_work_experience": [
    {
      "responsibilities": ["responsibility1", "responsibility2"]
    }
  ]
}
DO NOT include any other text or explanation outside of this JSON structure.`;

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
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: `Enhance this resume data for a ${resumeData.professional_summary.title} role. Return ONLY a JSON response with no other text:\n${JSON.stringify({
              work_experience: resumeData.work_experience,
              education: resumeData.education,
              certifications: resumeData.certifications
            })}`
          }
        ],
        temperature: 0.3, // Even lower temperature for strict JSON output
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw OpenAI response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No content in AI response');
    }

    let suggestions;
    try {
      const content = data.choices[0].message.content;
      console.log('Content to parse:', content);
      
      // Handle both string and object responses
      if (typeof content === 'string') {
        suggestions = JSON.parse(content.trim());
      } else {
        suggestions = content;
      }

      // Validate the response structure
      if (!suggestions.professional_summary || 
          !suggestions.skills?.hard_skills || 
          !suggestions.skills?.soft_skills || 
          !Array.isArray(suggestions.enhanced_work_experience)) {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Parse error:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    console.log('Valid suggestions:', JSON.stringify(suggestions));

    // Create Supabase client with explicit types
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Prepare update data
    const updateData = {
      professional_summary: {
        title: resumeData.professional_summary.title,
        summary: suggestions.professional_summary
      },
      skills: {
        hard_skills: suggestions.skills.hard_skills,
        soft_skills: suggestions.skills.soft_skills
      },
      work_experience: resumeData.work_experience.map((exp: any, idx: number) => ({
        ...exp,
        responsibilities: suggestions.enhanced_work_experience[idx]?.responsibilities || exp.responsibilities || []
      })),
      completion_status: 'completed'
    };

    console.log('Updating resume with:', JSON.stringify(updateData));

    const { error: updateError } = await supabaseClient
      .from('resumes')
      .update(updateData)
      .eq('id', resumeData.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw updateError;
    }

    console.log('Resume enhanced successfully:', resumeData.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Resume enhanced successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
