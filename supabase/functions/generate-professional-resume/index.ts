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
Extract 15 highly relevant keywords and phrases for a ${jobTitle} résumé based on the following job description:

"""
${targetJobDescription}
"""

RULES:
• Include exact terms, tools, technologies, and certifications used in the job description.
• Include synonyms or common variations for critical terms (e.g., "project management" and "PM").
• Avoid generic soft skills ("team player", "hardworking").
• Maintain the same casing as in the job description (e.g., "JavaScript" not "javascript").
• Output ONLY as a JSON array of strings, e.g.: ["keyword1", "keyword2", "keyword3", ...]
`;
    } else {
      keywordsPrompt = `
Generate 15 highly relevant keywords and phrases for a standard ${jobTitle} résumé.

RULES:
• Use industry-standard technical skills, certifications, and core competencies.
• Include both technical and role-specific terminology.
• Avoid generic soft skills.
• Output ONLY as a JSON array of strings, e.g.: ["keyword1", "keyword2", "keyword3", ...]
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
            content: 'You are an ATS (Applicant Tracking System) optimization specialist. Your task is to extract or generate only the most relevant keywords and key phrases that will improve the chances of a resume passing ATS filters. Always return them as an exact array of strings with no extra explanation.'
          },
          { role: 'user', content: keywordsPrompt }
        ],
        temperature: 0.3,
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

1. Structure (75–85 words total):
   • Headline: Include job title + a key specialization + a differentiator.
   • Experience Statement: "${experienceString}" with a natural reference to 2–3 domain expertise areas.
   • Achievement Hook: Include one quantified achievement (always use a numeric value; if missing, create a realistic, role-appropriate metric).
   • Value Statement: Highlight leadership or collaboration skills with a measurable business or team impact.

2. Technical Elements:
   • Seamlessly integrate 1–2 tools/technologies from the provided list.
   • Incorporate 2–3 target keywords from the provided list organically (never as a raw list).
   • Preserve exact casing for technical terms (e.g., JavaScript, AWS).

3. Writing Style:
   • Use active voice.
   • Keep sentences concise and impactful.
   • Ban cliché phrases like "results-driven," "proven track record," "passionate."
   • Avoid personal pronouns ("I", "my", "we").

FORMAT
• One single paragraph beginning with the headline.
• Balance technical, leadership, and business impact elements.
• Never exceed 85 words, never go below 75 words.
• Output only the final summary text without labels or formatting.
`;


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
            content: 'You are an elite professional resume writer and ATS optimization specialist. Your task is to write a high-impact professional resume summary that highlights domain expertise, quantified achievements, relevant tools, and leadership value. Your audience is Fortune 500 recruiters and hiring managers. If any contextual information is missing, intelligently infer industry-appropriate content without stating assumptions. Return only the summary text with no extra commentary. Ensure the tone is professional, the language is precise, and the result feels tailored for an executive-level review.'
          },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.6,
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
    const usedActionVerbs = new Set<string>();
    
    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i+1}: ${experience.jobTitle} at ${experience.companyName}`);
      
      const industry = (domainAreas[0] || jobTitle || '').trim();
      const keyProjects = achievements.join('; ');
      const tools = relevantTools.join(', ');
      const keywords = industryKeywords.join(', ');
      const companyContext = experience.companyName || '';
      const previouslyUsedVerbs = Array.from(usedActionVerbs).join(', ');

      const responsibilitiesPrompt = `
Write EXACTLY 4 achievement-focused resume bullet points for a ${experience.jobTitle} at ${experience.companyName}.

CONTEXT:
• Industry: ${industry}
• Key Projects/Responsibilities: ${keyProjects}
• Tools/Technologies: ${tools}
• Target Keywords: ${keywords}
• Company Overview: ${companyContext}
• Previously used action verbs across other roles (do NOT use any of these): ${previouslyUsedVerbs || 'None'}

REQUIREMENTS:
• Start each bullet with a UNIQUE action verb (no repeats within this role)
• Do NOT use any verb listed in "Previously used..."
• Each bullet must be 90–150 characters
• Integrate at least one relevant keyword and one tool/technology where natural
• Use past tense, professional, ATS-optimized language; no first-person
• Be specific, measurable when possible (add realistic metrics if missing); avoid fluff
• No ending periods; no semicolons; no emoji

OUTPUT:
• Return ONLY a JSON array of 4 strings: ["...","...","...","..."]
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
              content: 'You are an elite resume writer and ATS optimization expert. Your task is to generate achievement-oriented bullet points that showcase specific, high-impact contributions for the given role. Each bullet must start with a unique, powerful action verb, integrate industry-relevant keywords naturally, and convey measurable or clearly inferred impact. Return only the JSON array of bullet points with no explanation or formatting outside the array.'
            },
            { role: 'user', content: responsibilitiesPrompt }
          ],
          temperature: 0.6,
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
        let responsibilities: string[] = [];

        const parseArray = (text: string): string[] => {
          try {
            if (text.includes('[') && text.includes(']')) {
              const match = text.match(/\[([\s\S]*?)\]/);
              if (match) return JSON.parse(`[${match[1]}]`);
            }
          } catch {}
          return text
            .split(/\n|\r|\u2022|\-/)
            .map((r) => r.replace(/^[•\-\d.]\s*/, '').trim())
            .filter(Boolean);
        };

        responsibilities = parseArray(responseContent);

        const clean = (s: string) => s.replace(/[.\s]+$/, '').trim();
        responsibilities = responsibilities.map(clean);

        const withinLength = (s: string) => s.length >= 90 && s.length <= 150;
        let filtered = responsibilities.filter(withinLength);

        // Retry once if we didn't get exactly 4 bullets
        if (filtered.length !== 4) {
          const fixPrompt = `You previously generated the following bullets (may be too short/long or wrong count):\n${JSON.stringify(responsibilities)}\n\nRewrite and return EXACTLY 4 achievement bullets for ${experience.jobTitle} at ${experience.companyName} following the same constraints as before. Avoid these verbs: ${previouslyUsedVerbs || 'None'}. Output JSON array of 4 strings only.`;

          const retryResp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'Rewrite the bullets to meet constraints. Output only a JSON array of four strings.' },
                { role: 'user', content: fixPrompt }
              ],
              temperature: 0.5,
            }),
          });

          if (retryResp.ok) {
            const retryData = await retryResp.json();
            const retryContent = retryData.choices[0].message.content.trim();
            filtered = parseArray(retryContent).map(clean).filter(withinLength);
          }
        }

        // Fallbacks: ensure exactly 4 items
        let finalBullets = filtered.length >= 4
          ? filtered.slice(0, 4)
          : responsibilities.slice(0, 4).map(clean);

        // Enforce verb uniqueness tracking across roles
        const extractVerb = (s: string) => s.split(/\s+/)[0].replace(/[^A-Za-z]/g, '').toLowerCase();
        const hasDupWithin = new Set<string>();
        finalBullets = finalBullets.filter((b) => {
          const v = extractVerb(b);
          if (usedActionVerbs.has(v) || hasDupWithin.has(v)) return false;
          hasDupWithin.add(v);
          return true;
        });

        // If we removed some due to duplicates, backfill from original list
        if (finalBullets.length < 4) {
          for (const b of responsibilities) {
            if (finalBullets.length >= 4) break;
            const v = extractVerb(b);
            if (!usedActionVerbs.has(v) && !hasDupWithin.has(v)) {
              finalBullets.push(clean(b));
              hasDupWithin.add(v);
            }
          }
        }

        // Update used verbs set
        finalBullets.forEach((b) => usedActionVerbs.add(extractVerb(b)));

        if (finalBullets.length === 4) {
          enhancedExperiences.push({ ...experience, responsibilities: finalBullets });
          console.log(`Generated ${finalBullets.length} responsibilities for ${experience.jobTitle}`);
        } else {
          enhancedExperiences.push({ ...experience });
          console.log(`Using original responsibilities for ${experience.jobTitle}`);
        }
      } catch (e) {
        console.error(`Error processing responsibilities for ${experience.jobTitle}:`, e);
        enhancedExperiences.push({ ...experience });
      }
    }
    
    const industryContext = domainAreas.join(', ');
    const tools = relevantTools.join(', ');

    const skillsPrompt = `
Generate a skills list for a ${jobTitle} resume.

CONTEXT:
• Target Job Title: ${jobTitle}
• Available Keywords: ${industryKeywords.join(', ')}
• Industry Context: ${industryContext}
• Tools/Technologies: ${tools}

REQUIREMENTS:
• 6 hard skills (technical, industry-specific, or tools) — must reflect the most in-demand skills for the role
• 4 soft skills (role-relevant interpersonal, leadership, or organizational abilities)
• Hard skills must include at least 3 from the Available Keywords list, integrated naturally
• Allow widely recognized abbreviations (e.g., SQL, AWS, API) but write them in ATS-friendly form if applicable (“Amazon Web Services (AWS)”) 
• Soft skills must be specific and relevant to the role, not generic (e.g., “Technical Communication” instead of “Communication”)
• Order each category with the most important skills for the role first
• Capitalize each skill correctly

OUTPUT FORMAT:
{
  "hard_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
}

ABSOLUTE RULES:
• Output JSON only, no extra formatting or explanation
• Ensure every skill is ATS-optimized and job-relevant
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
            content: 'You are an elite resume writer and ATS optimization expert. Your task is to generate a JSON object of the most relevant skills for the given job title, ensuring ATS keyword alignment, proper categorization, and professional capitalization. Return only the JSON with no additional explanation or formatting.'
          },
          { role: 'user', content: skillsPrompt }
        ],
        temperature: 0.6,
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
