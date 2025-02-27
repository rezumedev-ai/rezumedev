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
    
    // Make a copy of the work experience array to ensure we're not modifying the original
    const enhancedExperiences = [];
    
    // First, get industry-specific keywords for the target position
    const keywordsPrompt = `
Generate the top 15 industry-specific keywords and phrases for a ${jobTitle} position that would best optimize a resume for ATS systems.

Consider:
- Technical skills specific to this role
- Industry terminology
- Certifications and qualifications
- Software and tools commonly used
- Methodologies and frameworks relevant to ${jobTitle}

Format your response as a JSON array of strings only, with no additional commentary. Example:
["Keyword 1", "Keyword 2", "Keyword 3", ...]
`;

    console.log('Generating industry-specific keywords for target position...');
    
    const keywordsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert in resume optimization and ATS systems. Generate only the requested list of keywords with no additional text.'
          },
          { role: 'user', content: keywordsPrompt }
        ],
        temperature: 0.5,
      }),
    });
    
    let industryKeywords = [];
    
    if (keywordsResponse.ok) {
      try {
        const keywordsData = await keywordsResponse.json();
        const keywordsContent = keywordsData.choices[0].message.content.trim();
        
        try {
          // First try parsing directly
          industryKeywords = JSON.parse(keywordsContent);
        } catch (e) {
          // If direct parsing fails, try to extract JSON portion
          const jsonMatch = keywordsContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            industryKeywords = JSON.parse(jsonMatch[0]);
          } else {
            // If that fails, fall back to line-by-line parsing
            industryKeywords = keywordsContent
              .split('\n')
              .filter(line => line.trim())
              .map(line => line.replace(/^[-•*]\s*/, '').trim());
          }
        }
        
        console.log(`Generated ${industryKeywords.length} industry keywords`);
      } catch (e) {
        console.error('Error parsing industry keywords:', e);
        // Continue without keywords if parsing fails
      }
    }
    
    // Process each work experience entry separately to ensure unique responsibilities
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i+1}: ${experience.jobTitle} at ${experience.companyName}`);
      
      // Create a job-specific prompt with a high temperature setting to ensure varied responses
      const jobPrompt = `
Generate 4 HIGHLY SPECIFIC job responsibilities for a ${experience.jobTitle} position at ${experience.companyName} that would impress a hiring manager.

Job Context:
- Job Title: ${experience.jobTitle}
- Company: ${experience.companyName}
${experience.location ? `- Location: ${experience.location}` : ''}
- Duration: ${experience.startDate} to ${experience.isCurrentJob ? 'Present' : experience.endDate}

Requirements:
1. Each bullet point must start with a POWERFUL action verb
2. Include specific technologies, methods, or tools relevant to this EXACT position
3. Include quantifiable metrics and achievements where possible (%, $, numbers)
4. Emphasize business impact and results
5. Use industry-specific terminology for this field
6. Each bullet must be completely different from the others

Mandatory: Use these industry keywords where relevant: ${industryKeywords.slice(0, 8).join(', ')}

DO NOT RETURN ANY EXPLANATION OR INTRODUCTION. RETURN ONLY A JSON ARRAY OF 4 STRING BULLET POINTS.
Example response format: ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"]

IMPORTANT: Generate COMPLETELY DIFFERENT content for each job. These responsibilities must be UNIQUE to this specific position.
`;

      // Add a random seed to ensure varied responses
      const randomSeed = Math.floor(Math.random() * 10000);
      
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
              content: `You are an expert resume writer who specializes in creating ATS-optimized, job-specific responsibilities. You must generate unique, tailored content for each job position. Never return generic responsibilities. Random seed: ${randomSeed}`
            },
            { role: 'user', content: jobPrompt }
          ],
          temperature: 0.9, // High temperature to ensure varied responses
        }),
      });

      if (!responsibilitiesResponse.ok) {
        console.error(`Error generating responsibilities for job ${i + 1}`);
        // Add the experience with original responsibilities to avoid empty entries
        enhancedExperiences.push({...experience});
        continue;
      }

      try {
        const respData = await responsibilitiesResponse.json();
        const responseContent = respData.choices[0].message.content.trim();
        
        // Try to parse the response as JSON
        let responsibilities = [];
        try {
          // First try parsing directly
          responsibilities = JSON.parse(responseContent);
        } catch (e) {
          // If direct parsing fails, try to extract JSON portion
          const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            responsibilities = JSON.parse(jsonMatch[0]);
          } else {
            // If that fails, fall back to line-by-line parsing
            responsibilities = responseContent
              .split('\n')
              .filter(line => line.trim())
              .map(line => line.replace(/^[-•*]\s*/, '').trim());
          }
        }
        
        if (responsibilities.length > 0) {
          enhancedExperiences.push({
            ...experience,
            responsibilities
          });
          console.log(`Generated ${responsibilities.length} responsibilities for ${experience.jobTitle}`);
        } else {
          // If we couldn't parse any responsibilities, keep the original
          enhancedExperiences.push({...experience});
          console.log(`Using original responsibilities for ${experience.jobTitle}`);
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
        // Keep the original experience data if processing fails
        enhancedExperiences.push({...experience});
      }
    }
    
    // Double-check we haven't accidentally created duplicate responsibilities
    // This is a final verification step to ensure our changes worked
    const allResponsibilitiesSets = new Map();
    
    for (let i = 0; i < enhancedExperiences.length; i++) {
      const respStr = enhancedExperiences[i].responsibilities.join('|');
      
      if (allResponsibilitiesSets.has(respStr)) {
        console.log(`WARNING: Detected duplicate responsibilities for job ${i+1}`);
        
        // Try to make this set of responsibilities unique by modifying them
        enhancedExperiences[i].responsibilities = enhancedExperiences[i].responsibilities.map(resp => {
          // Add job-specific prefix to make it unique
          return resp.replace(/^(Developed|Created|Managed|Led|Implemented|Designed|Built)/i, 
            `${enhancedExperiences[i].jobTitle.split(' ')[0]} ${enhancedExperiences[i].companyName.split(' ')[0]} -`);
        });
      }
      
      allResponsibilitiesSets.set(respStr, i);
    }
    
    // Generate skills relevant to the target job
    const skillsPrompt = `
Generate a comprehensive skills list for a ${jobTitle} resume that will maximize success with ATS systems.

Industry Context:
${industryKeywords.length > 0 ? `- Industry Keywords: ${industryKeywords.join(', ')}` : ''}

Requirements:
- Include 8 hard/technical skills that are HIGHLY SPECIFIC to the ${jobTitle} role
- Include 4 soft skills most valued for the ${jobTitle} position
- Prioritize skills that appear frequently in job postings for this role
- Include skills that demonstrate proficiency with industry-standard tools and methodologies
- Focus on in-demand skills that will make the candidate stand out
- List the skills in order of relevance/importance

Format your response as a JSON object with this exact structure:
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
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
            content: 'You are a professional resume skills expert. Generate skills that will help a candidate pass ATS systems and appeal to hiring managers. Return only the JSON object with no additional commentary.'
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
        "Performance Monitoring",
        "Risk Assessment",
        "Quality Assurance"
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
        const skillsContent = skillsData.choices[0].message.content.trim();
        
        // Try to parse the JSON from the response
        try {
          // First try parsing directly
          const parsedSkills = JSON.parse(skillsContent);
          if (parsedSkills && parsedSkills.hard_skills && parsedSkills.soft_skills) {
            skills = parsedSkills;
            console.log('Generated skills successfully');
          }
        } catch (e) {
          // If direct parsing fails, try to extract JSON portion
          const jsonMatch = skillsContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedSkills = JSON.parse(jsonMatch[0]);
            if (parsedSkills && parsedSkills.hard_skills && parsedSkills.soft_skills) {
              skills = parsedSkills;
              console.log('Generated skills successfully (extracted from response)');
            }
          } else {
            console.error('Failed to parse skills JSON:', e);
          }
        }
      } catch (e) {
        console.error('Error processing skills response:', e);
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

    console.log('Updating resume in database with enhanced data...');
    
    // Before update, log what we're about to update
    console.log('Number of work experiences being updated:', enhancedExperiences.length);
    for (const exp of enhancedExperiences) {
      console.log(`${exp.jobTitle} at ${exp.companyName}: ${exp.responsibilities.length} responsibilities`);
      // Log the first responsibility for each job to verify uniqueness
      if (exp.responsibilities.length > 0) {
        console.log(`First responsibility: ${exp.responsibilities[0].substring(0, 50)}...`);
      }
    }
    
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
