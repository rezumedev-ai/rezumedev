
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
    const enhancedExperiences = [...resumeData.work_experience];
    
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
        industryKeywords = JSON.parse(keywordsContent);
        console.log(`Generated ${industryKeywords.length} industry keywords`);
      } catch (e) {
        console.error('Error parsing industry keywords:', e);
        // Continue without keywords if parsing fails
      }
    }
    
    for (let i = 0; i < enhancedExperiences.length; i++) {
      const experience = enhancedExperiences[i];
      console.log(`Processing job experience: ${experience.jobTitle} at ${experience.companyName}`);
      
      // Create a detailed analysis of the job role first
      const jobAnalysisPrompt = `
Analyze the following job position in detail:

Job Title: ${experience.jobTitle}
Company: ${experience.companyName}
Industry Keywords: ${industryKeywords.join(', ')}

Return a detailed analysis of:
1. Core responsibilities typically associated with this exact role
2. Technical skills and tools commonly used in this position
3. Key performance metrics relevant to this role
4. Industry-specific terminology that should be included

Format your response as a JSON object with these four categories.
`;

      console.log(`Analyzing job role: ${experience.jobTitle}`);
      
      const jobAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are an expert job analyst who understands the specific responsibilities and skills for different job roles across industries. Provide detailed job analysis only.'
            },
            { role: 'user', content: jobAnalysisPrompt }
          ],
          temperature: 0.5,
        }),
      });
      
      let jobAnalysis = {
        responsibilities: [],
        skills: [],
        metrics: [],
        terminology: []
      };
      
      if (jobAnalysisResponse.ok) {
        try {
          const analysisData = await jobAnalysisResponse.json();
          const analysisContent = analysisData.choices[0].message.content.trim();
          // Extract the JSON part if there's text around it
          const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jobAnalysis = JSON.parse(jsonMatch[0]);
          } else {
            jobAnalysis = JSON.parse(analysisContent);
          }
          console.log(`Successfully analyzed job role: ${experience.jobTitle}`);
        } catch (e) {
          console.error('Error parsing job analysis:', e);
          // Continue with default job analysis if parsing fails
        }
      }
      
      // Now craft a job-specific prompt using the detailed analysis
      const responsibilitiesPrompt = `
Create 4-5 highly tailored, ATS-optimized bullet points for a ${experience.jobTitle} position at ${experience.companyName}.

Core Role Information:
- Title: ${experience.jobTitle}
- Company: ${experience.companyName}
- Duration: ${experience.startDate} to ${experience.isCurrentJob ? "Present" : experience.endDate}
${experience.location ? `- Location: ${experience.location}` : ""}

Job Role Analysis:
- Core Responsibilities: ${JSON.stringify(jobAnalysis.responsibilities)}
- Technical Skills: ${JSON.stringify(jobAnalysis.skills)}
- Key Metrics: ${JSON.stringify(jobAnalysis.metrics)}
- Industry Terminology: ${JSON.stringify(jobAnalysis.terminology)}
- Industry Keywords: ${industryKeywords.join(', ')}

Requirements for each bullet point:
1. Begin with a powerful, uncommon action verb (avoid overused words like "managed" or "developed")
2. Incorporate at least 2-3 industry-specific keywords from the analysis above
3. Include measurable achievements with specific metrics where possible (use percentages, numbers, dollar amounts)
4. Demonstrate impact on business outcomes, not just tasks performed
5. Use the STAR format (Situation, Task, Action, Result) to structure each point
6. Each bullet point should be 1-2 lines long (no more than 100 characters)
7. Use proper grammatical structure, present tense for current job, past tense for previous jobs
8. Highlight leadership, innovation, or technical expertise relevant to this specific role

Format your response as a JSON array of strings, with each string being a complete bullet point. Include EXACTLY 4 bullet points.
`;

      console.log(`Generating responsibilities for: ${experience.jobTitle}`);

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
              content: 'You are a professional resume writer specializing in creating highly tailored, ATS-optimized bullet points for job responsibilities. Ensure each bullet point is specific to the exact job title, incorporates relevant keywords, and highlights measurable achievements. Do not include generic responsibilities that could apply to any job.'
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
          enhancedExperiences[i] = {
            ...experience,
            responsibilities
          };
          console.log(`Generated ${responsibilities.length} responsibilities for ${experience.jobTitle}`);
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
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
