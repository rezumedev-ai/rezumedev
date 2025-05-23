import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateTotalExperience(workExperience: any[]): { years: number; months: number } {
  let totalMonths = 0;
  const now = new Date();

  workExperience.forEach(exp => {
    const startDate = new Date(exp.startDate);
    
    let endDate = exp.isCurrentJob || !exp.endDate || exp.endDate === 'Present' || exp.endDate === 'Current'
      ? now 
      : new Date(exp.endDate);

    if (isNaN(startDate.getTime())) {
      console.warn('Invalid start date found in experience:', exp);
      return;
    }

    if (isNaN(endDate.getTime())) {
      console.warn('Invalid end date found in experience, using current date:', exp);
      endDate = now;
    }

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    
    const days = endDate.getDate() - startDate.getDate();
    const partialMonth = days > 15 ? 1 : 0;
    
    totalMonths += Math.max(0, months + partialMonth);
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  return { years, months: remainingMonths };
}

function formatExperienceString(years: number, months: number): string {
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }

  if (months >= 8) {
    return `nearly ${years + 1} year${years + 1 !== 1 ? 's' : ''}`;
  }

  if (months >= 1) {
    return `more than ${years} year${years !== 1 ? 's' : ''}`;
  }

  return `${years} year${years !== 1 ? 's' : ''}`;
}

function extractDomainExpertise(workExperience: any[], jobTitle: string): string[] {
  const defaultDomains: Record<string, string[]> = {
    'software engineer': ['application development', 'code optimization', 'system architecture', 'debugging'],
    'data scientist': ['data analysis', 'machine learning', 'statistical modeling', 'data visualization'],
    'project manager': ['project planning', 'team leadership', 'risk management', 'stakeholder communication'],
    'marketing manager': ['campaign strategy', 'digital marketing', 'brand development', 'market analysis'],
    'sales representative': ['client acquisition', 'relationship building', 'product demonstration', 'negotiation'],
    'product manager': ['product strategy', 'user research', 'roadmap development', 'feature prioritization'],
    'ux designer': ['user research', 'wireframing', 'usability testing', 'information architecture'],
    'financial analyst': ['financial modeling', 'budget planning', 'investment analysis', 'risk assessment'],
    'human resources': ['talent acquisition', 'employee relations', 'performance management', 'policy development'],
    'customer service': ['conflict resolution', 'customer retention', 'problem-solving', 'communication'],
  };

  const allTitles = workExperience.map((exp: any) => exp.jobTitle.toLowerCase());
  const allResponsibilities = workExperience.flatMap((exp: any) => 
    Array.isArray(exp.responsibilities) ? exp.responsibilities : []);
  
  const keywords = new Map<string, number>();
  const domainTerms = [
    'develop', 'manage', 'lead', 'design', 'implement', 'analyze', 'create',
    'strategy', 'client', 'customer', 'product', 'project', 'team', 'research',
    'platform', 'solution', 'enterprise', 'digital', 'optimization', 'growth'
  ];
  
  allResponsibilities.forEach((resp: string) => {
    if (!resp) return;
    
    const words = resp.toLowerCase().split(/\s+/);
    domainTerms.forEach(term => {
      if (words.some(word => word.includes(term))) {
        keywords.set(term, (keywords.get(term) || 0) + 1);
      }
    });
  });
  
  const sortedKeywords = [...keywords.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  let bestMatch = '';
  let highestScore = -1;
  
  for (const [title, domains] of Object.entries(defaultDomains)) {
    const score = allTitles.reduce((acc, jobTitle) => {
      return acc + (jobTitle.includes(title) ? 1 : 0);
    }, 0);
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = title;
    }
  }
  
  const baseDomains = defaultDomains[bestMatch] || defaultDomains['project manager'];
  
  const customDomains: string[] = [];
  const industries = ['healthcare', 'finance', 'technology', 'retail', 'education', 'manufacturing', 'marketing'];
  
  allResponsibilities.forEach((resp: string) => {
    if (!resp) return;
    const respLower = resp.toLowerCase();
    
    industries.forEach(industry => {
      if (respLower.includes(industry) && !customDomains.includes(industry)) {
        customDomains.push(`${industry} solutions`);
      }
    });
  });
  
  const allDomains = [...new Set([...customDomains, ...baseDomains])];
  return allDomains.slice(0, 4);
}

function extractQuantifiedAchievements(workExperience: any[], jobTitle: string): string[] {
  const achievements: string[] = [];
  const allResponsibilities = workExperience.flatMap((exp: any) => 
    Array.isArray(exp.responsibilities) ? exp.responsibilities.map(resp => ({
      text: resp,
      jobTitle: exp.jobTitle
    })) : []);
  
  const quantifiedResponsibilities = allResponsibilities.filter((resp: any) => {
    if (!resp.text) return false;
    return /\d+\s*%|\$\s*\d+|\d+\s*million|\d+\s*[a-zA-Z]+/.test(resp.text);
  });
  
  if (quantifiedResponsibilities.length > 0) {
    achievements.push(...quantifiedResponsibilities.slice(0, 2).map((resp: any) => resp.text));
  } else {
    const jobTitleAchievements: Record<string, string[]> = {
      'software': [
        `Optimized application performance resulting in ${getRandomNumber(20, 45)}% reduction in load times`,
        `Led development of new features increasing user engagement by ${getRandomNumber(25, 40)}%`,
        `Implemented automated testing reducing production bugs by ${getRandomNumber(35, 60)}%`,
        `Architected microservices solution improving scalability by ${getRandomNumber(30, 50)}%`,
        `Reduced API response times by ${getRandomNumber(40, 70)}% through code optimization`,
        `Migrated legacy systems resulting in ${getRandomNumber(20, 35)}% cost savings`
      ],
      'data': [
        `Developed predictive models achieving ${getRandomNumber(85, 95)}% accuracy rate`,
        `Built data pipeline processing ${getRandomNumber(2, 10)} million records daily`,
        `Reduced data processing time by ${getRandomNumber(40, 60)}% through optimization`,
        `Created analytics dashboard saving ${getRandomNumber(10, 20)} hours weekly`,
        `Improved data quality metrics by ${getRandomNumber(25, 45)}%`,
        `Automated reporting workflows reducing manual effort by ${getRandomNumber(50, 70)}%`
      ],
      'product': [
        `Launched key features increasing user retention by ${getRandomNumber(15, 30)}%`,
        `Led product redesign improving customer satisfaction by ${getRandomNumber(20, 35)}%`,
        `Optimized user journey reducing churn by ${getRandomNumber(20, 40)}%`,
        `Implemented A/B testing improving conversion rates by ${getRandomNumber(15, 35)}%`,
        `Drove ${getRandomNumber(25, 45)}% increase in user engagement metrics`,
        `Reduced customer support tickets by ${getRandomNumber(30, 50)}% through UX improvements`
      ],
      'marketing': [
        `Generated ${getRandomNumber(30, 60)}% growth in qualified leads`,
        `Achieved ${getRandomNumber(20, 40)}% increase in conversion rates`,
        `Managed campaigns with ${getRandomNumber(15, 30)}% ROI improvement`,
        `Grew social media engagement by ${getRandomNumber(40, 70)}%`,
        `Increased organic traffic by ${getRandomNumber(35, 65)}% through SEO optimization`,
        `Reduced customer acquisition cost by ${getRandomNumber(20, 40)}%`
      ],
      'sales': [
        `Exceeded sales targets by ${getRandomNumber(20, 40)}% for consecutive quarters`,
        `Expanded client base by ${getRandomNumber(25, 45)}% through territory development`,
        `Generated ${getRandomNumber(2, 5)}M in new business revenue`,
        `Achieved ${getRandomNumber(110, 130)}% of annual sales quota`,
        `Reduced sales cycle length by ${getRandomNumber(20, 35)}%`,
        `Improved lead conversion rate by ${getRandomNumber(25, 45)}%`
      ],
      'design': [
        `Improved user engagement metrics by ${getRandomNumber(30, 50)}%`,
        `Reduced development time by ${getRandomNumber(25, 40)}% with new design system`,
        `Increased mobile conversion rate by ${getRandomNumber(20, 35)}%`,
        `Achieved ${getRandomNumber(15, 30)}% reduction in user error rates`,
        `Improved accessibility compliance by ${getRandomNumber(40, 60)}%`,
        `Reduced prototype iteration time by ${getRandomNumber(30, 50)}%`
      ],
      'finance': [
        `Identified cost savings of ${getRandomNumber(10, 25)}% annually`,
        `Improved budget accuracy by ${getRandomNumber(15, 30)}%`,
        `Reduced processing time by ${getRandomNumber(30, 50)}%`,
        `Achieved ${getRandomNumber(15, 25)}% reduction in operational costs`,
        `Increased forecast accuracy by ${getRandomNumber(20, 35)}%`,
        `Optimized cash flow improving working capital by ${getRandomNumber(15, 30)}%`
      ],
      'operations': [
        `Streamlined processes reducing costs by ${getRandomNumber(15, 30)}%`,
        `Improved operational efficiency by ${getRandomNumber(20, 40)}%`,
        `Reduced workflow bottlenecks by ${getRandomNumber(25, 45)}%`,
        `Achieved ${getRandomNumber(15, 30)}% improvement in delivery times`,
        `Optimized resource allocation saving ${getRandomNumber(20, 35)}%`,
        `Reduced operational errors by ${getRandomNumber(30, 50)}%`
      ],
      'hr': [
        `Reduced employee turnover by ${getRandomNumber(20, 40)}%`,
        `Improved hiring efficiency by ${getRandomNumber(25, 45)}%`,
        `Achieved ${getRandomNumber(90, 95)}% employee satisfaction rate`,
        `Reduced time-to-hire by ${getRandomNumber(30, 50)}%`,
        `Implemented training programs improving productivity by ${getRandomNumber(15, 30)}%`,
        `Decreased onboarding time by ${getRandomNumber(25, 40)}%`
      ]
    };
    
    let matchedCategory = '';
    const jobTitleLower = jobTitle.toLowerCase();
    const mostRecentJob = workExperience[0]?.jobTitle?.toLowerCase() || '';
    const allJobTitles = [jobTitleLower, mostRecentJob];
    
    for (const title of allJobTitles) {
      for (const [category, _] of Object.entries(jobTitleAchievements)) {
        if (
          title.includes(category) || 
          (category === 'software' && (
            title.includes('developer') || 
            title.includes('engineer') || 
            title.includes('programmer')
          )) ||
          (category === 'data' && (
            title.includes('analyst') || 
            title.includes('scientist') || 
            title.includes('analytics')
          )) ||
          (category === 'operations' && (
            title.includes('manager') || 
            title.includes('coordinator') || 
            title.includes('supervisor')
          ))
        ) {
          matchedCategory = category;
          break;
        }
      }
      if (matchedCategory) break;
    }
    
    if (!matchedCategory) {
      if (jobTitleLower.includes('director') || jobTitleLower.includes('head')) {
        matchedCategory = 'operations';
      } else if (jobTitleLower.includes('consultant')) {
        matchedCategory = mostRecentJob.includes('tech') ? 'software' : 'operations';
      }
    }
    
    const categoryAchievements = jobTitleAchievements[matchedCategory] || jobTitleAchievements['operations'];
    const selectedIndexes = new Set<number>();
    while (selectedIndexes.size < 2) {
      selectedIndexes.add(Math.floor(Math.random() * categoryAchievements.length));
    }
    achievements.push(...Array.from(selectedIndexes).map(i => categoryAchievements[i]));
  }
  
  return achievements;
}

function extractRelevantTools(workExperience: any[], jobTitle: string): string[] {
  const toolsByCategory: Record<string, string[]> = {
    'software': ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'CI/CD'],
    'data': ['SQL', 'Python', 'R', 'Tableau', 'PowerBI', 'Hadoop', 'Spark', 'TensorFlow', 'Excel'],
    'project': ['JIRA', 'MS Project', 'Asana', 'Trello', 'Agile', 'Scrum', 'Kanban', 'Slack'],
    'marketing': ['Google Analytics', 'HubSpot', 'SEO', 'SEM', 'Social Media', 'Mailchimp', 'Adobe Creative Suite'],
    'sales': ['Salesforce', 'HubSpot CRM', 'LinkedIn Sales Navigator', 'Outreach', 'Gong', 'ZoomInfo'],
    'product': ['JIRA', 'ProductPlan', 'Amplitude', 'Figma', 'Mixpanel', 'User Testing', 'Agile methodologies'],
    'design': ['Adobe Creative Suite', 'Figma', 'Sketch', 'InVision', 'Zeplin', 'UX Research', 'Wireframing'],
    'finance': ['Excel', 'QuickBooks', 'SAP', 'Oracle', 'Bloomberg Terminal', 'Power BI', 'Financial modeling'],
    'hr': ['HRIS', 'ATS', 'Workday', 'BambooHR', 'SAP SuccessFactors', 'Performance management systems']
  };
  
  let relevantCategory = 'project';
  Object.keys(toolsByCategory).forEach(category => {
    if (jobTitle.toLowerCase().includes(category)) {
      relevantCategory = category;
    }
  });
  
  const mentionedTools = new Set<string>();
  workExperience.forEach(exp => {
    if (!Array.isArray(exp.responsibilities)) return;
    
    exp.responsibilities.forEach((resp: string) => {
      if (!resp) return;
      const respLower = resp.toLowerCase();
      
      Object.values(toolsByCategory).flat().forEach(tool => {
        if (respLower.includes(tool.toLowerCase())) {
          mentionedTools.add(tool);
        }
      });
    });
  });
  
  const relevantTools = Array.from(mentionedTools);
  const categoryTools = toolsByCategory[relevantCategory] || [];
  
  if (relevantTools.length < 3) {
    categoryTools.forEach(tool => {
      if (relevantTools.length < 3 && !relevantTools.includes(tool)) {
        relevantTools.push(tool);
      }
    });
  }
  
  return relevantTools.slice(0, 3);
}

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

    const experience = calculateTotalExperience(resumeData.work_experience);
    const experienceString = formatExperienceString(experience.years, experience.months);
    
    const domainAreas = extractDomainExpertise(resumeData.work_experience, jobTitle);
    console.log('Extracted domain expertise areas:', domainAreas);
    
    const achievements = extractQuantifiedAchievements(resumeData.work_experience, jobTitle);
    console.log('Extracted/generated quantified achievements:', achievements);
    
    const relevantTools = extractRelevantTools(resumeData.work_experience, jobTitle);
    console.log('Relevant tools and technologies:', relevantTools);

    const summaryPrompt = `
Generate a professional summary for a ${jobTitle}.

CONTEXT
• Experience: ${experienceString}
• Job Title: ${jobTitle}
• Domain Expertise: ${domainAreas.join(', ')}
• Key Tools/Technologies: ${relevantTools.join(', ')}
• Notable Achievements: ${achievements.join('; ')}
• Target Keywords: ${industryKeywords.join(', ')}

REQUIREMENTS
1. Structure (70-90 words total):
   • Headline: Include job title and key specialization
   • Experience Statement: "${experienceString}" with focus in [domain areas]
   • Achievement Hook: Include one quantified achievement from provided list
   • Value Statement: Combine leadership soft-skill with target impact
2. Technical Elements:
   • Incorporate 1-2 relevant tools/technologies from provided list
   • Reference 2-3 domain expertise areas naturally
   • Use 2-3 target keywords from context
3. Writing Style:
   • Active voice
   • Professional tone
   • No clichés ("results-driven," "proven track record")
   • Omit personal pronouns

FORMAT
• Write in paragraph form with headline
• Focus on specialization and expertise
• Must include exact experience duration: "${experienceString}"
• Include one clear, quantified achievement`;

    console.log('Calling OpenAI API for enhanced professional summary...');
    
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
            content: 'Write a professional resume summary that includes domain expertise, quantified achievements, relevant tools, and leadership value. Return only the summary text. Ensure achievements are specific and varied.'
          },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!summaryResponse.ok) {
      console.error('OpenAI API error for summary:', await summaryResponse.text());
      throw new Error('Failed to generate summary');
    }

    const summaryData = await summaryResponse.json();
    const enhancedSummary = summaryData.choices[0].message.content.trim();

    // Sanitize summary by removing all "**" markdown formatting
    const cleanSummary = enhancedSummary.replace(/\*\*/g, '').trim();
    console.log('Clean summary:', cleanSummary);
    
    const enhancedExperiences = [];
    
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i+1}: ${experience.jobTitle} at ${experience.companyName}`);
      
      const responsibilitiesPrompt = `
Write 4 bullet points for a ${experience.jobTitle} at ${experience.companyName}.

ACTION VERBS LIST (use different verbs for each bullet)
Developed, Implemented, Managed, Coordinated, Designed, Established, Created, Executed,
Launched, Spearheaded, Streamlined, Enhanced, Transformed, Revamped, Orchestrated,
Pioneered, Formulated, Generated, Initiated, Oversaw

REQUIREMENTS
• Each bullet MUST start with a different action verb from the list above
• No metrics or numbers
• Focus on impact and achievements
• 60‑80 characters per bullet
• No period at end
• Avoid generic descriptions
• Must be specific to the role and company

FORMATTING
• Return as array: ["point 1", "point 2", ...]
• Proper capitalization
• Past tense only
• Professional tone`;

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
              content: 'Generate resume bullet points with unique action verbs. Each bullet must start with a different verb. Ensure professional tone and specificity to the role. Return only the JSON array of points.'
            },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.7,
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

        if (responseContent.includes('[') && responseContent.includes(']')) {
          const match = responseContent.match(/\[([^\]]+)\]/);
          if (match) {
            responsibilities = JSON.parse(`[${match[1]}]`);
          }
        } else {
          responsibilities = responseContent.split('\n').map(r => r.replace(/^[•\-\d.]\s*/, '').trim());
        }

        // Basic formatting cleanup
        responsibilities = responsibilities
          .map(resp => resp.trim())
          .filter(resp => resp.length >= 30 && resp.length <= 100);

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
    
    const updatePayload = {
      professional_summary: {
        ...resumeData.professional_summary,
        summary: cleanSummary
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
