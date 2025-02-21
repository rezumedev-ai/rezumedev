
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    
    // Enhanced validation
    if (!resumeData || !resumeId) {
      throw new Error('Missing required resume data or ID');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    console.log('Starting enhancement for resume:', resumeId);

    // Enhanced system prompt for ATS optimization
    const systemPrompt = `You are an expert ATS resume optimizer and professional resume writer with experience in top-tier tech companies and Fortune 500 organizations. Your role is to:
1. Optimize content to pass modern ATS systems
2. Use industry-standard formatting and terminology
3. Focus on quantifiable achievements and metrics
4. Incorporate relevant keywords based on the job title
5. Ensure all content is clear, concise, and impactful
6. Match the writing style to the industry and seniority level
Always use action verbs and focus on achievements rather than responsibilities.`;

    try {
      // First, enhance the professional summary
      console.log('Enhancing professional summary...');
      const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `Create an ATS-optimized professional summary for a ${resumeData.professional_summary.title} position. 
                       Current summary: ${resumeData.professional_summary.summary}
                       Make it compelling, keyword-rich, and focused on achievements.` 
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary: ' + await summaryResponse.text());
      }

      const summaryData = await summaryResponse.json();
      const enhancedSummary = summaryData.choices[0].message.content;

      // Enhance work experience
      console.log('Enhancing work experience...');
      const enhancedExperience = await Promise.all(
        resumeData.work_experience.map(async (exp) => {
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
                  content: `Transform these job responsibilities into ATS-optimized, achievement-focused bullet points for a ${exp.jobTitle} role:
                           Current responsibilities: ${exp.responsibilities.join('\n')}
                           Focus on metrics, achievements, and industry-specific keywords.` 
                }
              ],
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to enhance experience: ' + await response.text());
          }

          const data = await response.json();
          return {
            ...exp,
            responsibilities: data.choices[0].message.content
              .split('\n')
              .filter(Boolean)
              .map(line => line.replace(/^[-•]\s*/, '')) // Clean up bullets
          };
        })
      );

      // Enhance and organize skills
      console.log('Enhancing skills...');
      const skillsPrompt = `Optimize and organize these skills for an ATS-friendly resume for a ${resumeData.professional_summary.title} position:
                           Hard Skills: ${resumeData.skills.hard_skills.join(', ')}
                           Soft Skills: ${resumeData.skills.soft_skills.join(', ')}
                           Add any critical missing skills for this role and organize them by category.`;
      
      const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: skillsPrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!skillsResponse.ok) {
        throw new Error('Failed to enhance skills: ' + await skillsResponse.text());
      }

      const skillsData = await skillsResponse.json();
      const enhancedSkills = {
        hard_skills: resumeData.skills.hard_skills,
        soft_skills: resumeData.skills.soft_skills,
        ...JSON.parse(skillsData.choices[0].message.content)
      };

      // Update the resume with enhanced content
      console.log('Updating resume with enhanced content...');
      const { error: updateError } = await supabase
        .from('resumes')
        .update({
          professional_summary: {
            ...resumeData.professional_summary,
            summary: enhancedSummary
          },
          work_experience: enhancedExperience,
          skills: enhancedSkills,
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
          message: 'Resume enhanced successfully',
          resumeId: resumeId 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (apiError) {
      console.error('API Error:', apiError);
      // Update resume status to error
      await supabase
        .from('resumes')
        .update({ completion_status: 'error' })
        .eq('id', resumeId);
      throw apiError;
    }

  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to enhance resume. Please try again or contact support if the issue persists.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
