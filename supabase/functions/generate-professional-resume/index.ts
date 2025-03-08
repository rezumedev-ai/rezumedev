import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, resumeId } = await req.json();
    
    if (!resumeId) {
      throw new Error('Resume ID is required');
    }

    console.log(`Starting resume enhancement for ID: ${resumeId}`);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase
      .from('resumes')
      .update({ completion_status: 'enhancing' })
      .eq('id', resumeId);
    
    const jobTitle = resumeData.professional_summary?.title || '';
    const targetJobDescription = resumeData.professional_summary?.targetJobDescription || '';
    
    const summaryPrompt = `
Create a powerful professional summary for a ${jobTitle} based on the following information:
${JSON.stringify(resumeData.personal_info, null, 2)}
${JSON.stringify(resumeData.professional_summary, null, 2)}
${targetJobDescription ? `\nTarget Job Description: ${targetJobDescription}` : ''}

Requirements:
- Write 3-4 sentences (around 60-80 words) to create a comprehensive professional summary
- Highlight value and expertise without metrics or years
- Use powerful, active language
${targetJobDescription ? '- Align with the skills and requirements from the provided job description' : '- Include relevant industry keywords for ATS systems'}
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
            content: 'You are a professional resume writer specializing in ATS-optimized content. Create only the requested text with no additional commentary. Keep content concise and impactful.'
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
    
    const enhancedExperiences = [];
    
    let keywordsPrompt = '';
    
    if (targetJobDescription) {
      keywordsPrompt = `
Extract the top 10 most important skills, keywords, and qualifications from this job description for a ${jobTitle} position:

${targetJobDescription}

Make sure to include specific technical skills, methodologies, and qualifications mentioned in the job posting.

Format your response as a JSON array of strings only, with no additional commentary. Example:
["Keyword 1", "Keyword 2", "Keyword 3", ...]
`;
    } else {
      keywordsPrompt = `
Generate the top 10 industry-specific keywords and phrases for a ${jobTitle} position that would best optimize a resume for ATS systems.

Consider:
- Technical skills specific to this role
- Industry terminology
- Certifications and qualifications
- Software and tools commonly used
- Methodologies and frameworks relevant to ${jobTitle}

Format your response as a JSON array of strings only, with no additional commentary. Example:
["Keyword 1", "Keyword 2", "Keyword 3", ...]
`;
    }

    console.log(targetJobDescription 
      ? 'Extracting keywords from provided job description...' 
      : 'Generating industry-specific keywords for target position...');
    
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
          industryKeywords = JSON.parse(keywordsContent);
        } catch (e) {
          const jsonMatch = keywordsContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            industryKeywords = JSON.parse(jsonMatch[0]);
          } else {
            industryKeywords = keywordsContent
              .split('\n')
              .filter(line => line.trim())
              .map(line => line.replace(/^[-•*]\s*/, '').trim());
          }
        }
        
        console.log(`Generated ${industryKeywords.length} industry keywords`);
      } catch (e) {
        console.error('Error parsing industry keywords:', e);
      }
    }
    
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i+1}: ${experience.jobTitle} at ${experience.companyName}`);
      
      let jobPrompt = `
Generate 3-4 CONCISE, HIGHLY SPECIFIC job responsibilities for a ${experience.jobTitle} position at ${experience.companyName} that would impress a hiring manager.

Job Context:
- Job Title: ${experience.jobTitle}
- Company: ${experience.companyName}
${experience.location ? `- Location: ${experience.location}` : ''}
- Duration: ${experience.startDate} to ${experience.isCurrentJob ? 'Present' : experience.endDate}
`;

      if (targetJobDescription) {
        jobPrompt += `
Target Job Description:
${targetJobDescription}

Requirements:
1. Each bullet point must start with a strong action verb
2. Each bullet point MUST be 60-80 characters maximum (strict limit for A4 page fitting)
3. Include 1-2 keywords from the target job description in each bullet
4. Ensure the responsibilities align well with what the target job requires
5. DO NOT include specific percentage improvements or metrics
6. Use precise wording and eliminate unnecessary words
7. Ensure all bullets are different from each other
`;
      } else {
        jobPrompt += `
Requirements:
1. Each bullet point must start with a strong action verb
2. Each bullet point MUST be 60-80 characters maximum (strict limit for A4 page fitting)
3. Include 1-2 industry-specific keywords in each bullet
4. DO NOT include specific percentage improvements or metrics
5. Use precise wording and eliminate unnecessary words
6. Ensure all bullets are different from each other
`;
      }

      jobPrompt += `
Format Tips:
- Do NOT use complete sentences - use resume-style fragments
- Avoid articles (a, an, the) when possible
- Use present tense for current job, past tense for previous jobs
- Focus on achievements and skills rather than metrics

DO NOT RETURN ANY EXPLANATION OR INTRODUCTION. RETURN ONLY A JSON ARRAY OF STRING BULLET POINTS.
Example response format: ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"]

IMPORTANT: The bullets MUST be under 80 characters each to fit on a standard A4 resume.
DO NOT include percentage metrics or specific numerical achievements.
`;

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
              content: `You are an expert resume writer who specializes in creating ATS-optimized, job-specific responsibilities that fit perfectly on an A4 page. You must create CONCISE bullet points that are no more than 80 characters each. Do not include specific percentage or numerical metrics. Random seed: ${randomSeed}`
            },
            { role: 'user', content: jobPrompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!responsibilitiesResponse.ok) {
        console.error(`Error generating responsibilities for job ${i + 1}`);
        enhancedExperiences.push({...experience});
        continue;
      }

      try {
        const respData = await responsibilitiesResponse.json();
        const responseContent = respData.choices[0].message.content.trim();
        
        let responsibilities = [];
        try {
          responsibilities = JSON.parse(responseContent);
        } catch (e) {
          const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            responsibilities = JSON.parse(jsonMatch[0]);
          } else {
            responsibilities = responseContent
              .split('\n')
              .filter(line => line.trim())
              .map(line => line.replace(/^[-•*]\s*/, '').trim());
          }
        }
        
        responsibilities = responsibilities.map(resp => {
          let cleanedResp = resp.replace(/\s+by\s+\d+%/gi, '');
          cleanedResp = cleanedResp.replace(/\d+%/gi, '');
          cleanedResp = cleanedResp.replace(/reducing\s+by/gi, 'reducing');
          cleanedResp = cleanedResp.replace(/increasing\s+by/gi, 'increasing');
          cleanedResp = cleanedResp.replace(/improving\s+by/gi, 'improving');
          cleanedResp = cleanedResp.replace(/enhancing\s+by/gi, 'enhancing');
          cleanedResp = cleanedResp.replace(/\s+\s+/g, ' ');
          cleanedResp = cleanedResp.trim();
          
          if (responsibilities.length > 4) {
            responsibilities = responsibilities.slice(0, 4);
          }
          
          return cleanedResp;
        });
        
        if (responsibilities.length > 0) {
          enhancedExperiences.push({
            ...experience,
            responsibilities
          });
          
          console.log(`Generated ${responsibilities.length} responsibilities for ${experience.jobTitle}:`);
          responsibilities.forEach((resp, idx) => {
            console.log(`  ${idx+1}. Length: ${resp.length} chars - ${resp}`);
          });
        } else {
          enhancedExperiences.push({...experience});
          console.log(`Using original responsibilities for ${experience.jobTitle}`);
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
        enhancedExperiences.push({...experience});
      }
    }
    
    const allResponsibilitiesSets = new Map();
    
    for (let i = 0; i < enhancedExperiences.length; i++) {
      const respStr = enhancedExperiences[i].responsibilities.join('|');
      
      if (allResponsibilitiesSets.has(respStr)) {
        console.log(`WARNING: Detected duplicate responsibilities for job ${i+1}`);
        
        enhancedExperiences[i].responsibilities = enhancedExperiences[i].responsibilities.map(resp => {
          const prefix = `${enhancedExperiences[i].jobTitle.split(' ')[0]}: `;
          return prefix + resp;
        });
      }
      
      allResponsibilitiesSets.set(respStr, i);
    }
    
    let skillsPrompt = '';
    
    if (targetJobDescription) {
      skillsPrompt = `
Extract a concise skills list for a ${jobTitle} resume based on this job description:

${targetJobDescription}

Requirements:
- Include 6 hard/technical skills that are SPECIFICALLY MENTIONED or CLEARLY NEEDED for this job
- Include 4 soft skills most valued in the job description
- Prioritize skills that appear explicitly in the job description
- Focus on skills that will help the resume match the job requirements
- AVOID ALL ABBREVIATIONS AND SHORT FORMS - write out each skill completely (example: "Project Management" not "Project Mgmt")
- Each skill should be properly capitalized and use complete words

Format your response as a JSON object with this exact structure:
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}
`;
    } else {
      skillsPrompt = `
Generate a concise skills list for a ${jobTitle} resume that will maximize success with ATS systems.

Industry Context:
${industryKeywords.length > 0 ? `- Industry Keywords: ${industryKeywords.join(', ')}` : ''}

Requirements:
- Include 6 hard/technical skills that are SPECIFIC to the ${jobTitle} role
- Include 4 soft skills most valued for the ${jobTitle} position
- Prioritize skills that appear frequently in job postings for this role
- AVOID ALL ABBREVIATIONS AND SHORT FORMS - write out each skill completely (example: "Project Management" not "Project Mgmt")
- Each skill should be properly capitalized and use complete words
- Focus on skills that will help the resume fit on a single A4 page

Format your response as a JSON object with this exact structure:
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}
`;
    }

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
            content: 'You are a professional resume skills expert. Generate concise skills that will help a candidate pass ATS systems and fit on a single A4 page. Return only the JSON object with no additional commentary.'
          },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.7,
      }),
    });

    let skills = {
      hard_skills: [
        "Project Management", 
        "Data Analysis",
        "Process Improvement",
        "Reporting",
        "Budgeting",
        "Team Leadership"
      ],
      soft_skills: [
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Adaptability"
      ]
    };

    if (skillsResponse.ok) {
      try {
        const skillsData = await skillsResponse.json();
        const skillsContent = skillsData.choices[0].message.content.trim();
        
        try {
          const parsedSkills = JSON.parse(skillsContent);
          if (parsedSkills && parsedSkills.hard_skills && parsedSkills.soft_skills) {
            skills = parsedSkills;
            console.log('Generated skills successfully');
          }
        } catch (e) {
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
      }
    } else {
      console.error('Error calling OpenAI for skills');
    }
    
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
