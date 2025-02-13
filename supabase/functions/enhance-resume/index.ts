
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { resumeData } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key')
    }

    const systemPrompt = `You are an expert resume writer and career counselor. Your task is to enhance the resume by:
    1. Creating a compelling professional summary
    2. Identifying and adding relevant skills based on work experience and desired role
    3. Improving job responsibility descriptions to be more impactful and ATS-friendly
    4. Ensuring all content is optimized for ATS systems
    Use the candidate's work history, education, and desired role to create highly relevant content.
    Format your response as a JSON object with the following structure:
    {
      "professional_summary": "string",
      "skills": {
        "hard_skills": ["skill1", "skill2"],
        "soft_skills": ["skill1", "skill2"]
      },
      "enhanced_work_experience": [{
        "company": "string",
        "responsibilities": ["string"]
      }]
    }`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
      }),
    })

    const data = await response.json()
    const suggestions = JSON.parse(data.choices[0].message.content)

    // Store suggestions in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: summaryError } = await supabaseClient
      .from('ai_suggestions')
      .insert({
        resume_id: resumeData.id,
        section: 'professional_summary',
        suggestion: suggestions.professional_summary,
        priority: 'high'
      })

    if (summaryError) throw summaryError

    const { error: skillsError } = await supabaseClient
      .from('ai_suggestions')
      .insert({
        resume_id: resumeData.id,
        section: 'skills',
        suggestion: JSON.stringify(suggestions.skills),
        priority: 'high'
      })

    if (skillsError) throw skillsError

    for (const experience of suggestions.enhanced_work_experience) {
      const { error: expError } = await supabaseClient
        .from('ai_suggestions')
        .insert({
          resume_id: resumeData.id,
          section: 'work_experience',
          suggestion: JSON.stringify(experience),
          priority: 'medium'
        })

      if (expError) throw expError
    }

    return new Response(
      JSON.stringify({ success: true, suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
