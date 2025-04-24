
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
    // Check if job description is provided
    const targetJobDescription = resumeData.professional_summary?.targetJobDescription || '';
    
    // First, get industry-specific keywords for the target position
    let keywordsPrompt = '';
    
    if (targetJobDescription) {
      keywordsPrompt = `
Extract keywords for a ${jobTitle} résumé from this job description:

"""
${targetJobDescription}
"""

RULES
• Extract 15 important keywords & phrases
• Prioritize specific skills, tools, technologies
• Skip generic phrases ("team player")
• Output format: ["keyword1", "keyword2", ...]`;
    } else {
      keywordsPrompt = `
Generate keywords for a standard ${jobTitle} résumé.

RULES
• List 15 important keywords & phrases
• Focus on industry‑standard skills & competencies
• Include technical & soft skills
• Output format: ["keyword1", "keyword2", ...]`;
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
            content: 'Extract or generate keywords that will help this resume pass ATS systems. Return only the array of keywords.'
          },
          { role: 'user', content: keywordsPrompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!keywordsResponse.ok) {
      console.error('OpenAI API error for keywords:', await keywordsResponse.text());
      throw new Error('Failed to generate keywords');
    }
    
    const keywordsData = await keywordsResponse.json();
    const keywordsContent = keywordsData.choices[0].message.content.trim();
    let industryKeywords = [];
    
    try {
      // Try parsing the keywords response
      if (keywordsContent.includes('[') && keywordsContent.includes(']')) {
        const match = keywordsContent.match(/\[([^\]]+)\]/);
        if (match) {
          industryKeywords = JSON.parse(`[${match[1]}]`);
        }
      } else {
        industryKeywords = keywordsContent.split('\n').map(k => k.replace(/^[•\-\d.]\s*/, '').trim());
      }
    } catch (e) {
      console.error('Error parsing keywords:', e);
      industryKeywords = [];
    }
    
    console.log('Generated keywords:', industryKeywords);

    // Generate professional summary with the keywords
    const summaryPrompt = `
Write a professional summary for a ${jobTitle}.

CONTEXT
• Job Title: ${jobTitle}
• Target Keywords: ${industryKeywords.join(', ')}

REQUIREMENTS
1. Write 3‑4 impactful sentences (50‑70 words)
2. Structure:
   • Opening: Strong value proposition
   • Middle: Core skills & achievements
   • Close: Career focus statement
3. Incorporate 2‑3 target keywords naturally
4. Use active voice
5. No clichés ("results‑driven," "proven track record")
6. Omit personal pronouns
7. No specific metrics/years

FORMAT
• Write in paragraph form
• Focus on value delivery
• Keep natural flow`;

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
            content: 'Write a professional resume summary. Return only the summary text.'
          },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!summaryResponse.ok) {
      console.error('OpenAI API error for summary:', await summaryResponse.text());
      throw new Error('Failed to generate summary');
    }

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content.trim();
    console.log('Generated professional summary');
    
    // Process each work experience entry with the generated keywords
    const enhancedExperiences = [];
    
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i+1}: ${experience.jobTitle} at ${experience.companyName}`);
      
      const responsibilitiesPrompt = `
Write 4 bullet points for a ${experience.jobTitle} at ${experience.companyName}.

AVAILABLE KEYWORDS
${industryKeywords.join(', ')}

REQUIREMENTS
• Start each with a past‑tense verb
• 60‑80 characters per bullet
• Include 1 keyword per bullet
• Focus on achievements
• No metrics/numbers
• No period at end

FORMATTING
• Return as array: ["point 1", "point 2", ...]
• Start each with action verb
• Use proper capitalization`;

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
              content: 'Generate resume bullet points. Return only the JSON array of points.'
            },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!responsibilitiesResponse.ok) {
        console.error(`Error generating responsibilities for ${experience.jobTitle}:`, await responsibilitiesResponse.text());
        enhancedExperiences.push({...experience});
        continue;
      }

      try {
        const respData = await responsibilitiesResponse.json();
        const responseContent = respData.choices[0].message.content.trim();
        let responsibilities = [];

        // Parse the response content
        if (responseContent.includes('[') && responseContent.includes(']')) {
          const match = responseContent.match(/\[([^\]]+)\]/);
          if (match) {
            responsibilities = JSON.parse(`[${match[1]}]`);
          }
        } else {
          responsibilities = responseContent.split('\n').map(r => r.replace(/^[•\-\d.]\s*/, '').trim());
        }

        // Clean up responsibilities
        responsibilities = responsibilities
          .map(resp => {
            // Remove metrics and standardize format
            let clean = resp
              .replace(/\d+%/g, '')
              .replace(/increased|decreased|improved|enhanced|reduced|optimized/g, 'enhanced')
              .replace(/\s+/g, ' ')
              .trim();
            
            // Ensure starts with past tense verb
            if (!/^[A-Z][a-z]+ed\b/.test(clean)) {
              clean = `Led ${clean}`;
            }
            
            return clean;
          })
          .filter(resp => resp.length >= 30 && resp.length <= 100);

        // Limit to 4 responsibilities
        responsibilities = responsibilities.slice(0, 4);
        
        if (responsibilities.length > 0) {
          enhancedExperiences.push({
            ...experience,
            responsibilities
          });
          
          console.log(`Generated ${responsibilities.length} responsibilities for ${experience.jobTitle}`);
        } else {
          enhancedExperiences.push({...experience});
          console.log(`Using original responsibilities for ${experience.jobTitle}`);
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
        enhancedExperiences.push({...experience});
      }
    }
    
    // Generate skills using the keywords
    const skillsPrompt = `
Generate skills for a ${jobTitle} resume.

AVAILABLE KEYWORDS
${industryKeywords.join(', ')}

REQUIREMENTS
• 6 technical/hard skills
• 4 soft skills
• Use full words (no abbreviations)
• Capitalize properly

OUTPUT FORMAT
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}`;

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
            content: 'Generate a JSON object with skills for a resume. Return only the JSON.'
          },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!skillsResponse.ok) {
      console.error('OpenAI API error for skills:', await skillsResponse.text());
      throw new Error('Failed to generate skills');
    }

    const skillsData = await skillsResponse.json();
    const skillsContent = skillsData.choices[0].message.content.trim();
    let skills = {
      hard_skills: [],
      soft_skills: []
    };

    try {
      if (skillsContent.includes('{') && skillsContent.includes('}')) {
        const match = skillsContent.match(/\{([^}]+)\}/);
        if (match) {
          skills = JSON.parse(`{${match[1]}}`);
        }
      }
    } catch (e) {
      console.error('Error parsing skills:', e);
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

    console.log('Updating resume with enhanced data...');
    
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
