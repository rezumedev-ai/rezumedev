
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ResumeData } from "../../../src/types/resume.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generatePrompt = (quizData: any) => `
Generate a professional, ATS-optimized resume using ONLY the following provided information. Do not make assumptions or add information not provided:

CONTACT INFORMATION:
- Full Name: ${quizData.personal_info.fullName}
- Email: ${quizData.personal_info.email}
- Phone: ${quizData.personal_info.phone}
${quizData.personal_info.linkedin ? `- LinkedIn: ${quizData.personal_info.linkedin}` : ''}
${quizData.personal_info.website ? `- Website: ${quizData.personal_info.website}` : ''}

TARGET ROLE: ${quizData.professional_summary.title}

WORK EXPERIENCE:
${JSON.stringify(quizData.work_experience, null, 2)}

EDUCATION:
${JSON.stringify(quizData.education, null, 2)}

${quizData.certifications.length > 0 ? `CERTIFICATIONS:
${JSON.stringify(quizData.certifications, null, 2)}` : ''}

SKILLS:
${JSON.stringify(quizData.skills, null, 2)}

Format requirements:
1. Create a concise, impactful professional summary focused on the target role
2. Transform work experience bullet points to be achievement-focused with measurable results
3. Ensure all content fits on one A4 page
4. Use industry-specific keywords for ATS optimization
5. Maintain a professional, direct tone
6. Format skills in a clean, comma-separated list without ratings
7. Include only factual information from the provided data

Response format:
Return a JSON object with the following structure:
{
  "personal_info": {...},
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
  "education": [...],
  "skills": {
    "hard_skills": string[],
    "soft_skills": string[]
  },
  "certifications": [...],
  "ats_keywords": string[]
}
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    console.log('Generating resume with data:', JSON.stringify(resumeData, null, 2));

    const prompt = generatePrompt(resumeData);

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
            content: 'You are an expert resume writer specializing in ATS-optimized resumes for top tech companies. Generate content that is professional, achievement-focused, and keyword-optimized while strictly using only the provided information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5, // Balance between creativity and consistency
        max_tokens: 2000, // Ensure we have enough tokens for a complete resume
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    const enhancedResume = JSON.parse(data.choices[0].message.content);

    // Update the resume in the database
    const { data: updateData, error: updateError } = await supabase
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
      .eq('id', resumeData.id);

    if (updateError) throw updateError;

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
    console.error('Error in generate-resume function:', error);
    
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
