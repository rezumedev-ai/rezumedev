
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
    
    // Extract job title from resumeData for the overall summary
    const jobTitle = resumeData.professional_summary?.title || '';
    
    // Generate professional summary
    const summaryPrompt = `
Create a powerful professional summary for a ${jobTitle} based on the following information:
${JSON.stringify(resumeData.personal_info, null, 2)}
${JSON.stringify(resumeData.professional_summary, null, 2)}

Requirements:
- Maximum 50 words
- Highlight value and expertise without metrics or years
- Use powerful, active language
- Include relevant industry keywords for ATS systems
- Focus on what makes this candidate valuable to employers
- Make it tailored specifically for a ${jobTitle} role

Format your response as plain text only (no JSON).
`;

    console.log('Calling OpenAI API for professional summary...');
    
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a professional resume writer specializing in ATS-optimized content. Create only the requested text with no additional commentary.'
          },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error('OpenAI API error for summary:', errorText);
      throw new Error(`OpenAI API error: ${summaryResponse.status} ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content.trim();
    console.log('Generated professional summary');
    
    // Process each work experience entry individually to generate relevant responsibilities
    const enhancedExperiences = [...resumeData.work_experience];
    
    for (let i = 0; i < enhancedExperiences.length; i++) {
      const experience = enhancedExperiences[i];
      console.log(`Processing job experience: ${experience.jobTitle} at ${experience.companyName}`);
      
      // Craft a job-specific prompt for each role
      const responsibilitiesPrompt = `
Create 3-4 highly relevant, impactful bullet points for a ${experience.jobTitle} position at ${experience.companyName} that would appear on a resume.

Job Details:
- Title: ${experience.jobTitle}
- Company: ${experience.companyName}
- Duration: ${experience.startDate} to ${experience.isCurrentJob ? "Present" : experience.endDate}
${experience.location ? `- Location: ${experience.location}` : ""}

Requirements for each bullet point:
1. Start with a strong action verb
2. Be specific to the ${experience.jobTitle} role and industry
3. Include relevant technical terms and keywords for ATS systems
4. Focus on achievements and impact, not just duties
5. Be between 50-100 characters each
6. Be concrete and avoid generic statements
7. Avoid first-person pronouns
8. Use proper industry terminology

Format your response as exactly 3-4 bullet points, one per line, with no additional text, numbering, or commentary.
`;

      const responsibilitiesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are a professional resume writer specializing in creating job-specific bullet points that pass ATS systems and impress hiring managers. Write exactly what is requested with no additional text.'
            },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!responsibilitiesResponse.ok) {
        console.error(`Error generating responsibilities for job ${i + 1}`);
        continue; // Continue with next job if this one fails
      }

      const respData = await responsibilitiesResponse.json();
      const responsibilities = respData.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim());

      if (responsibilities.length > 0) {
        enhancedExperiences[i] = {
          ...experience,
          responsibilities
        };
        console.log(`Generated ${responsibilities.length} responsibilities for ${experience.jobTitle}`);
      }
    }
    
    // Generate skills relevant to the target job
    const skillsPrompt = `
Generate a skills list for a ${jobTitle} resume that will pass ATS systems.

Requirements:
- Include 6 hard/technical skills specific to the ${jobTitle} role
- Include 4 soft skills relevant for the ${jobTitle} position
- Use industry standard terminology
- Include important keywords that ATS systems look for
- Skills should be specific, not generic
- Base on current industry standards

Format your response as a JSON object with this exact structure:
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}
`;

    const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a professional resume skills expert. Generate skills that will help a candidate pass ATS systems. Return only the JSON object with no additional commentary.'
          },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.7,
      }),
    });

    let skills = {
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
    };

    if (skillsResponse.ok) {
      try {
        const skillsData = await skillsResponse.json();
        const parsedSkills = JSON.parse(skillsData.choices[0].message.content);
        if (parsedSkills && parsedSkills.hard_skills && parsedSkills.soft_skills) {
          skills = parsedSkills;
          console.log('Generated skills successfully');
        }
      } catch (e) {
        console.error('Error parsing skills:', e);
        // We'll use the default skills defined above
      }
    } else {
      console.error('Error calling OpenAI for skills');
      // We'll use the default skills defined above
    }
    
    // Update the resume in the database
    const updatePayload = {
      professional_summary: {
        ...resumeData.professional_summary,
        summary: enhancedSummary
      },
      work_experience: enhancedExperiences,
      skills: skills,
      completion_status: 'completed'
    };

    console.log('Updating resume in database...');
    
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
