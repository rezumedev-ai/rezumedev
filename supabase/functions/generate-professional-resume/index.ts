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
    
    // Process each work experience entry individually to generate highly tailored responsibilities
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
    
    // Use a cache to ensure we don't generate duplicate responsibilities
    const responsibilitiesCache = new Map();
    
    // Process each work experience INDEPENDENTLY
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience: ${experience.jobTitle} at ${experience.companyName}`);
      
      // Create a more detailed and specific prompt for each job
      // Generate job-specific terminology and keywords first
      const jobSpecificPrompt = `
Analyze this exact job role and company and provide job-specific terminology and keywords:

Job Title: ${experience.jobTitle}
Company: ${experience.companyName}
${experience.location ? `Location: ${experience.location}` : ""}
Industry: ${experience.companyName ? `Related to ${experience.companyName}` : "Unknown"}

Return ONLY a JSON object with:
1. An array of 10 job-specific technical terms for this exact role
2. An array of 10 industry-specific action verbs appropriate for this role
3. An array of 10 metrics commonly used to measure success in this role
4. An array of 10 tools/technologies frequently used in this role

Format:
{
  "technical_terms": ["term1", "term2", ...],
  "action_verbs": ["verb1", "verb2", ...],
  "metrics": ["metric1", "metric2", ...],
  "tools": ["tool1", "tool2", ...]
}
`;

      const jobSpecificResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are an expert in specific job roles and industries. For each job title and company, provide terminology, verbs, metrics, and tools that are HIGHLY SPECIFIC to that exact position. DO NOT provide generic terms that could apply to any job. Your response must be in valid JSON format only.'
            },
            { role: 'user', content: jobSpecificPrompt }
          ],
          temperature: 0.6,
        }),
      });
      
      let jobSpecificTerms = {
        technical_terms: [],
        action_verbs: [],
        metrics: [],
        tools: []
      };
      
      if (jobSpecificResponse.ok) {
        try {
          const jobSpecificData = await jobSpecificResponse.json();
          const jobSpecificContent = jobSpecificData.choices[0].message.content.trim();
          
          try {
            // First try parsing directly
            jobSpecificTerms = JSON.parse(jobSpecificContent);
          } catch (e) {
            // If direct parsing fails, try to extract JSON portion
            const jsonMatch = jobSpecificContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jobSpecificTerms = JSON.parse(jsonMatch[0]);
            } else {
              console.error('Failed to parse job-specific terms:', e);
            }
          }
          
          console.log(`Generated job-specific terms for ${experience.jobTitle}`);
        } catch (e) {
          console.error('Error processing job-specific terms:', e);
        }
      }
      
      // Craft very specific responsibilities prompt using job-specific terminology
      const responsibilitiesPrompt = `
Create 4-5 HIGHLY SPECIFIC and UNIQUE bullet points for the exact role of ${experience.jobTitle} at ${experience.companyName}.

Job Details:
- Title: ${experience.jobTitle}
- Company: ${experience.companyName}
- Duration: ${experience.startDate} to ${experience.isCurrentJob ? "Present" : experience.endDate}
${experience.location ? `- Location: ${experience.location}` : ""}

Job-Specific Context:
- Technical Terms: ${jobSpecificTerms.technical_terms.join(', ')}
- Industry Action Verbs: ${jobSpecificTerms.action_verbs.join(', ')}
- Relevant Metrics: ${jobSpecificTerms.metrics.join(', ')}
- Tools/Technologies: ${jobSpecificTerms.tools.join(', ')}
- Industry Keywords: ${industryKeywords.join(', ')}

Requirements:
1. Each bullet point MUST be COMPLETELY UNIQUE to this specific role at this specific company
2. Each bullet MUST begin with a powerful action verb from the provided list or similar
3. Each bullet MUST include at least 2-3 technical terms or tools specific to this role
4. Each bullet MUST include quantifiable achievements with metrics when possible
5. Focus on impact and results, not just responsibilities
6. NEVER use generic phrases like "Led initiatives" or "Managed projects" without specifics
7. Length: 1-2 lines per bullet point (80-100 characters)
8. Use industry-specific language that would impress a hiring manager in this field

Format your response as a JSON array of strings ONLY. Each string should be one complete bullet point.
Example: ["Bullet point 1", "Bullet point 2", ...]
`;

      console.log(`Generating responsibilities for: ${experience.jobTitle} at ${experience.companyName}`);

      // Add a unique seed to ensure different responses even for similar roles
      const uniqueSeed = Date.now() + Math.random();
      
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
              content: `You are a professional resume writer specializing in creating highly tailored, ATS-optimized bullet points for the EXACT job title: ${experience.jobTitle} at ${experience.companyName}. NEVER return generic responsibilities. Each response must be hyper-specific to this exact role and company, with specific metrics, tools, and terminology. Return ONLY the JSON array of bullet points with no other text. Seed: ${uniqueSeed}`
            },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.9, // Higher temperature for more variation
        }),
      });

      if (!responsibilitiesResponse.ok) {
        console.error(`Error generating responsibilities for job ${i + 1}`);
        // Add the original responsibilities to avoid blank entries
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
        
        // Check if these responsibilities are already in our cache (avoid duplicates)
        const respKey = responsibilities.join('|');
        if (responsibilitiesCache.has(respKey)) {
          console.log(`Duplicate responsibilities detected for ${experience.jobTitle}, regenerating...`);
          
          // Try one more time with higher temperature
          const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                  content: `You are a professional resume writer. Generate COMPLETELY UNIQUE bullet points for ${experience.jobTitle} at ${experience.companyName}. These MUST be different from any typical responsibilities. Use specific metrics, technical terms, and unique action verbs. Seed: ${uniqueSeed + 1}`
                },
                { role: 'user', content: responsibilitiesPrompt }
              ],
              temperature: 1.0, // Maximum temperature for highest variation
            }),
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            const retryContent = retryData.choices[0].message.content.trim();
            
            try {
              responsibilities = JSON.parse(retryContent);
            } catch (e) {
              const jsonMatch = retryContent.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                responsibilities = JSON.parse(jsonMatch[0]);
              }
            }
            
            // If we still have duplicates, modify the responses slightly
            const retryKey = responsibilities.join('|');
            if (responsibilitiesCache.has(retryKey)) {
              responsibilities = responsibilities.map(resp => {
                // Add a slight variation to make it unique
                const words = resp.split(' ');
                if (words.length > 3) {
                  // Replace one adjective or adverb if present
                  for (let i = 0; i < words.length; i++) {
                    if (words[i].endsWith('ly') || words[i].endsWith('ive')) {
                      const variations = ['expertly', 'effectively', 'strategically', 'successfully', 'innovatively'];
                      words[i] = variations[Math.floor(Math.random() * variations.length)];
                      break;
                    }
                  }
                }
                return words.join(' ');
              });
            }
          }
        }
        
        // Add to cache to avoid future duplicates
        responsibilitiesCache.set(responsibilities.join('|'), true);
        
        if (responsibilities.length > 0) {
          enhancedExperiences.push({
            ...experience,
            responsibilities
          });
          console.log(`Generated ${responsibilities.length} unique responsibilities for ${experience.jobTitle}`);
        } else {
          // If we still failed to get responsibilities, keep the original
          enhancedExperiences.push({...experience});
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
        // Keep the original experience data if processing fails
        enhancedExperiences.push({...experience});
      }
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
