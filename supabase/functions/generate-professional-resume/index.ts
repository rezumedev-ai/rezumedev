import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// GPT-5 MINI ELITE SUMMARY SYSTEM PROMPT
// ============================================================================
const ELITE_SUMMARY_SYSTEM_PROMPT = `You are an elite Resume Strategist and Executive Career Coach who has helped 500+ professionals land roles at FAANG companies (Google, Meta, Amazon, Apple, Netflix, Microsoft), top-tier consulting firms (McKinsey, BCG, Bain), and unicorn startups.

EXPERTISE:
• Fortune 500 executive resume writing
• ATS optimization for enterprise recruiting systems
• FAANG-level achievement storytelling
• Industry-specific technical terminology
• Seniority-appropriate language and scope

CORE MISSION:
Write a professional summary that positions the candidate as a top-tier hire by:
1. Showcasing domain expertise with technical precision
2. Highlighting quantifiable business impact
3. Demonstrating leadership and strategic thinking
4. Integrating ATS keywords organically
5. Maintaining executive-level professionalism

WRITING PRINCIPLES:

1. AUTHENTICITY OVER EMBELLISHMENT
   • Enhance what exists, never fabricate
   • Use realistic scope indicators
   • Ground claims in provided experience

2. SPECIFICITY OVER GENERALITY
   • Name specific technologies, methodologies, frameworks
   • Reference actual industries and domains
   • Use concrete impact descriptors

3. IMPACT OVER ACTIVITIES
   • Focus on outcomes, not tasks
   • Emphasize business value and user impact
   • Highlight scale and scope

4. LEADERSHIP SIGNALS
   • Cross-functional collaboration
   • Strategic initiative ownership
   • Team influence and mentorship
   • Stakeholder management

5. TECHNICAL CREDIBILITY
   • Industry-standard terminology
   • Tool/technology expertise
   • Architectural thinking
   • Best practices and methodologies

BANNED PHRASES (Never use these):
• "Results-driven", "Proven track record", "Passionate about"
• "Detail-oriented", "Team player", "Go-getter", "Self-starter"
• "Think outside the box", "Hit the ground running", "Wear many hats"
• "Synergy", "Leverage" (as verb), "Utilize", "Facilitate"
• "Motivated professional", "Seeking opportunities", "Looking for"
• "Hard worker", "Fast learner", "People person"
• "Dynamic", "Innovative" (without context), "Cutting-edge"

SENIORITY-APPROPRIATE LANGUAGE:

Junior (0-3 years):
• Verbs: Contributed, Supported, Assisted, Developed, Implemented
• Scope: Individual projects, team collaboration, learning
• Focus: Technical skills, growth mindset, foundational expertise

Mid-Level (3-7 years):
• Verbs: Led, Managed, Designed, Architected, Optimized
• Scope: Project ownership, cross-team collaboration, mentorship
• Focus: Technical depth, business impact, leadership emergence

Senior (7-12 years):
• Verbs: Spearheaded, Architected, Transformed, Drove, Pioneered
• Scope: Multi-team initiatives, strategic projects, org-level impact
• Focus: Strategic thinking, technical excellence, proven leadership

Principal/Staff+ (12+ years):
• Verbs: Established, Defined, Transformed, Revolutionized, Scaled
• Scope: Org-wide initiatives, industry influence, technical vision
• Focus: Technical strategy, organizational impact, thought leadership

TONE CALIBRATION BY INDUSTRY:

Tech/Software:
• Emphasize: Technical architecture, scalability, performance
• Keywords: Microservices, cloud platforms, DevOps, agile
• Metrics: Uptime, latency, user growth, system performance

Finance/Fintech:
• Emphasize: Risk management, compliance, data accuracy
• Keywords: Regulatory compliance, financial modeling, risk mitigation
• Metrics: Cost savings, accuracy rates, portfolio performance

Healthcare/Biotech:
• Emphasize: Patient outcomes, compliance, data security
• Keywords: HIPAA, clinical workflows, patient care, regulatory
• Metrics: Patient satisfaction, efficiency gains, compliance rates

Consulting/Strategy:
• Emphasize: Client impact, strategic insights, problem-solving
• Keywords: Strategic planning, stakeholder management, transformation
• Metrics: Client satisfaction, revenue impact, cost optimization

Marketing/Growth:
• Emphasize: User acquisition, engagement, brand building
• Keywords: Growth hacking, conversion optimization, brand strategy
• Metrics: CAC, LTV, conversion rates, engagement metrics

OUTPUT REQUIREMENTS:
• Return ONLY the summary text
• No preambles, labels, or meta-commentary
• Single paragraph format
• Exactly 75-90 words (strict enforcement)
• Active voice, past tense for past roles
• No personal pronouns (I, my, we)
• Professional, confident, executive tone`;


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

// ============================================================================
// GPT-5 MINI HELPER FUNCTIONS FOR ENHANCED SUMMARY GENERATION
// ============================================================================

function calculateSeniorityLevel(years: number): string {
  if (years < 3) return 'Junior';
  if (years < 7) return 'Mid-Level';
  if (years < 12) return 'Senior';
  return 'Principal';
}

function formatEducation(education: any[]): string {
  if (!education || education.length === 0) return 'Not specified';

  const prestigiousSchools = [
    'MIT', 'Stanford', 'Harvard', 'Yale', 'Princeton', 'Berkeley', 'CMU',
    'Columbia', 'Cornell', 'Caltech', 'University of Pennsylvania', 'UPenn',
    'Duke', 'Northwestern', 'University of Chicago', 'Johns Hopkins'
  ];
  const advancedDegrees = ['MBA', 'MS', 'PhD', 'MA', 'M.S.', 'Ph.D.', 'M.A.'];

  return education
    .map(edu => {
      const isPrestigious = prestigiousSchools.some(school =>
        edu.institution?.includes(school)
      );
      const isAdvanced = advancedDegrees.some(deg =>
        edu.degree?.includes(deg)
      );

      if (isPrestigious || isAdvanced) {
        return `${edu.degree} from ${edu.institution}`;
      }
      return `${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}`;
    })
    .join(', ');
}

function formatCertifications(certs: any[]): string {
  if (!certs || certs.length === 0) return 'None listed';
  return certs.map(c => c.name).slice(0, 5).join(', ');
}

function createWorkSummary(experiences: any[]): string {
  if (!experiences || experiences.length === 0) return 'No experience listed';

  return experiences
    .slice(0, 3)
    .map(exp => {
      const duration = exp.isCurrentJob ? 'Present' : (exp.endDate || 'N/A');
      return `${exp.jobTitle} at ${exp.companyName} (${exp.startDate}-${duration})`;
    })
    .join(' → ');
}

function extractPrimaryIndustry(workExperience: any[]): string {
  if (!workExperience || workExperience.length === 0) return 'General';

  const industries: Record<string, string[]> = {
    'Technology': ['software', 'engineer', 'developer', 'tech', 'IT', 'data', 'cloud', 'AI'],
    'Finance': ['finance', 'banking', 'investment', 'analyst', 'fintech', 'trading'],
    'Healthcare': ['healthcare', 'medical', 'clinical', 'hospital', 'pharma', 'biotech'],
    'Consulting': ['consultant', 'consulting', 'strategy', 'advisory'],
    'Marketing': ['marketing', 'brand', 'digital marketing', 'growth', 'SEO', 'content'],
    'Sales': ['sales', 'business development', 'account', 'revenue'],
    'Product': ['product manager', 'product', 'PM'],
    'Design': ['designer', 'UX', 'UI', 'creative'],
    'Operations': ['operations', 'logistics', 'supply chain', 'project manager']
  };

  const allTitles = workExperience.map(exp => exp.jobTitle?.toLowerCase() || '').join(' ');

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => allTitles.includes(keyword))) {
      return industry;
    }
  }

  return 'Professional Services';
}

function detectSpecialContext(resumeData: any): string {
  const contexts: string[] = [];

  if (resumeData.work_experience && resumeData.work_experience.length >= 2) {
    const industries = resumeData.work_experience.map((exp: any) =>
      extractPrimaryIndustry([exp])
    );
    const uniqueIndustries = new Set(industries);
    if (uniqueIndustries.size >= 2) {
      contexts.push('Career transition across industries');
    }
  }

  if (resumeData.education && resumeData.education.length > 0) {
    const mostRecentEdu = resumeData.education[0];
    const gradYear = parseInt(mostRecentEdu.graduationYear);
    const currentYear = new Date().getFullYear();
    if (currentYear - gradYear <= 2) {
      contexts.push('Recent graduate');
    }
  }

  return contexts.length > 0 ? contexts.join('; ') : 'None';
}

function extractJobDescriptionInsights(targetJobDescription?: string): string {
  if (!targetJobDescription || targetJobDescription.trim().length < 50) {
    return 'Not provided';
  }

  const keywords: string[] = [];
  const commonSkills = [
    'leadership', 'management', 'agile', 'scrum', 'python', 'javascript',
    'react', 'node', 'aws', 'azure', 'kubernetes', 'docker', 'sql',
    'machine learning', 'data analysis', 'project management'
  ];

  const descLower = targetJobDescription.toLowerCase();
  commonSkills.forEach(skill => {
    if (descLower.includes(skill)) {
      keywords.push(skill);
    }
  });

  return keywords.length > 0
    ? `Key requirements: ${keywords.slice(0, 5).join(', ')}`
    : 'General professional role';
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

    // Build enhanced context for GPT-5 mini
    const seniorityLevel = calculateSeniorityLevel(experience.years);
    const primaryIndustry = extractPrimaryIndustry(resumeData.work_experience);
    const educationSummary = formatEducation(resumeData.education);
    const certificationsList = formatCertifications(resumeData.certifications);
    const workSummary = createWorkSummary(resumeData.work_experience);
    const jobInsights = extractJobDescriptionInsights(targetJobDescription);
    const specialContext = detectSpecialContext(resumeData);
    const mostRecentJob = resumeData.work_experience[0] || {};

    const summaryPrompt = `Generate a FAANG-caliber professional summary for this candidate.

CANDIDATE PROFILE:
• Target Role: ${jobTitle}
• Current/Most Recent Role: ${mostRecentJob.jobTitle || jobTitle} at ${mostRecentJob.companyName || 'Current Company'}
• Total Experience: ${experience.years} years, ${experience.months} months
• Seniority Level: ${seniorityLevel}
• Industry Focus: ${primaryIndustry}

EDUCATION:
${educationSummary}

CERTIFICATIONS:
${certificationsList}

WORK EXPERIENCE CONTEXT:
${workSummary}

DOMAIN EXPERTISE:
${domainAreas.join(', ')}

TECHNICAL PROFICIENCY:
${relevantTools.join(', ')}

QUANTIFIED ACHIEVEMENTS:
${achievements.join(' | ')}

ATS KEYWORDS (integrate 3-5 naturally):
${industryKeywords.join(', ')}

TARGET JOB DESCRIPTION INSIGHTS:
${jobInsights}

SPECIAL CONTEXT:
${specialContext}

REQUIREMENTS:

1. STRUCTURE (75-90 words):
   • Opening Hook: ${jobTitle} with ${experienceString} of expertise
   • Core Competencies: Highlight 2-3 domain areas with technical depth
   • Impact Statement: Showcase 1-2 quantified achievements
   • Value Proposition: End with leadership quality or strategic capability

2. TECHNICAL INTEGRATION:
   • Weave in 2-3 tools/technologies: ${relevantTools.join(', ')}
   • Use exact casing (JavaScript not javascript, AWS not aws)
   • Integrate 3-5 ATS keywords organically

3. SENIORITY CALIBRATION:
   • Adjust verb strength for ${seniorityLevel} level
   • Scale scope appropriately

4. STYLE REQUIREMENTS:
   • Active voice, confident tone
   • No clichés from banned list
   • Executive-level polish

CRITICAL CONSTRAINTS:
• Word count: 75-90 words (strict)
• No personal pronouns
• No banned phrases
• Return ONLY the summary text`;


    console.log('Calling GPT-5 mini API for FAANG-level professional summary...');
    console.log('Enhanced context:', { seniorityLevel, primaryIndustry, educationSummary });

    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: ELITE_SUMMARY_SYSTEM_PROMPT
          },
          { role: 'user', content: summaryPrompt }
        ],
        max_completion_tokens: 250,
      }),
    });

    if (!summaryResponse.ok) {
      console.error('GPT-5 mini API error for summary:', await summaryResponse.text());
      throw new Error('Failed to generate summary with GPT-5 mini');
    }

    const summaryData = await summaryResponse.json();
    console.log('GPT-5 mini full response:', JSON.stringify(summaryData, null, 2));
    const enhancedSummary = summaryData.choices[0].message.content.trim();

    // Sanitize summary by removing all "**" markdown formatting
    const cleanSummary = enhancedSummary.replace(/\*\*/g, '').trim();
    console.log('GPT-5 generated summary:', cleanSummary);
    console.log('Summary word count:', cleanSummary.split(/\s+/).length);
    console.log('Summary length (chars):', cleanSummary.length);

    const enhancedExperiences = [];
    const usedActionVerbs = new Set<string>();

    for (let i = 0; i < resumeData.work_experience.length; i++) {
      const experience = resumeData.work_experience[i];
      console.log(`Processing job experience ${i + 1}: ${experience.jobTitle} at ${experience.companyName}`);

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
        enhancedExperiences.push({ ...experience });
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
          } catch { }
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
