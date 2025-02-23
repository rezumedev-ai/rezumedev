
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateEnhancedPrompt = (resumeData: any) => `
As an expert ATS resume optimizer for top tech companies like Google and OpenAI, enhance this resume while strictly adhering to these guidelines:

1. CONTACT INFORMATION (use only provided data):
${JSON.stringify(resumeData.personal_info, null, 2)}

2. PROFESSIONAL SUMMARY:
Create a concise, impactful summary for the role: ${resumeData.professional_summary.title}
- Focus on actual experience and achievements
- Include relevant industry keywords
- Keep tone professional and direct
- No assumptions or exaggerations

3. WORK EXPERIENCE:
Transform these experiences into achievement-focused bullet points:
${JSON.stringify(resumeData.work_experience, null, 2)}

Guidelines for each position:
- Convert responsibilities into measurable achievements
- Focus on impact and results
- Use action verbs and industry keywords
- Maintain ATS compatibility
- Ensure all content fits one A4 page

4. EDUCATION (keep simple and factual):
${JSON.stringify(resumeData.education, null, 2)}

${resumeData.certifications?.length > 0 ? `5. CERTIFICATIONS:
${JSON.stringify(resumeData.certifications, null, 2)}` : ''}

6. SKILLS:
Current skills: ${JSON.stringify(resumeData.skills, null, 2)}
- Generate relevant technical and soft skills based on experience
- Format as clean, comma-separated list
- No rating scales or levels
- Focus on skills relevant to ${resumeData.professional_summary.title}

FORMAT REQUIREMENTS:
- Single A4 page layout
- Smart spacing based on content volume
- No fluff or filler content
- Rich in relevant ATS keywords while maintaining readability
- Achievement-focused bullet points
- Clear hierarchy of information

Return JSON with this exact structure:
{
  "personal_info": {
    "fullName": string,
    "email": string,
    "phone": string,
    "linkedin": string (optional),
    "website": string (optional)
  },
  "professional_summary": {
    "title": string,
    "summary": string
  },
  "work_experience": [{
    "jobTitle": string,
    "companyName": string,
    "location": string,
    "startDate": string,
    "endDate": string,
    "isCurrentJob": boolean,
    "responsibilities": string[],
    "achievements": string[]
  }],
  "education": [{
    "degreeName": string,
    "schoolName": string,
    "startDate": string,
    "endDate": string,
    "isCurrentlyEnrolled": boolean
  }],
  "skills": {
    "hard_skills": string[],
    "soft_skills": string[]
  },
  "certifications": [{
    "name": string,
    "organization": string,
    "completionDate": string
  }],
  "ats_keywords": string[]
}

Use ONLY the information provided. Do not invent or assume any details.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    
    console.log('Enhancing resume:', resumeId);
    console.log('Input data:', JSON.stringify(resumeData, null, 2));

    const prompt = generateEnhancedPrompt(resumeData);

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert ATS resume optimizer specializing in tech industry resumes. Generate content that is professional, achievement-focused, and keyword-optimized while strictly using only the provided information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!completion.ok) {
      throw new Error(`OpenAI API error: ${completion.statusText}`);
    }

    const response = await completion.json();
    console.log('OpenAI response received');

    const enhancedResume = JSON.parse(response.choices[0].message.content);
    console.log('Enhanced resume generated:', JSON.stringify(enhancedResume, null, 2));

    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        personal_info: enhancedResume.personal_info,
        professional_summary: enhancedResume.professional_summary,
        work_experience: enhancedResume.work_experience,
        education: enhancedResume.education,
        skills: enhancedResume.skills,
        certifications: enhancedResume.certifications,
        ats_keywords: enhancedResume.ats_keywords,
        completion_status: 'completed'
      })
      .eq('id', resumeId);

    if (updateError) {
      console.error('Error updating resume:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: enhancedResume 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    
    // Try to update the resume status to error if possible
    if (error.resumeId) {
      try {
        await supabase
          .from('resumes')
          .update({ completion_status: 'error' })
          .eq('id', error.resumeId);
      } catch (updateError) {
        console.error('Failed to update resume status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
