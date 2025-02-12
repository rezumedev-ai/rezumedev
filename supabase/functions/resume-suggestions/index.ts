
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, jobTitle, workExperience, skills } = await req.json();

    let prompt = '';
    switch (type) {
      case 'summary':
        prompt = `Write a professional and concise summary for a ${jobTitle} position. 
                 Focus only on general professional qualities and aspirations WITHOUT making assumptions about years of experience or specific achievements.
                 Keep it under 3 sentences and make it impactful and modern.
                 Start with "Motivated professional seeking a position as a ${jobTitle}..."`;
        break;
      case 'skills':
        prompt = `For a ${jobTitle} position, provide:
                 1. A list of 10 most relevant technical skills (hard skills) that are commonly required or beneficial
                 2. A list of 5 important soft skills that would make someone successful in this role
                 Format as JSON with two arrays: "technical_skills" and "soft_skills". Only return the JSON.`;
        break;
      case 'responsibilities':
        prompt = `List 5 key job responsibilities that are typically expected for a ${jobTitle} position.
                 Focus on common industry-standard duties without making assumptions about seniority level.
                 Format them as a JSON array of strings. Only return the JSON array.`;
        break;
      default:
        throw new Error('Invalid suggestion type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a professional resume writer with expertise in career development and job search. Provide clear, professional suggestions without making assumptions about experience level unless specifically provided.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in resume-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
