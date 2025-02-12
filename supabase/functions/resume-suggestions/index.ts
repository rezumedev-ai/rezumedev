
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
        prompt = `Write a professional and concise summary for a ${jobTitle} position. Keep it under 4 sentences and highlight key professional qualities. Make it impactful and modern.`;
        break;
      case 'skills':
        prompt = `List 10 most relevant technical skills and 5 soft skills for a ${jobTitle} position. Format as JSON with two arrays: "technical_skills" and "soft_skills". Only return the JSON.`;
        break;
      case 'responsibilities':
        prompt = `Suggest 5 key job responsibilities for a ${jobTitle} position. Format them as a JSON array of strings. Only return the JSON array.`;
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
          { role: 'system', content: 'You are a professional resume writer with expertise in career development and job search.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

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
