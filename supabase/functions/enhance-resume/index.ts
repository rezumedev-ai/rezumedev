
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { resumeData } = await req.json();

    const prompt = `
      Create a concise, professional, and ATS-friendly resume content that fits on a single A4 page for a ${resumeData.professional_summary.title} position.
      Focus on including relevant keywords and achievements. Keep descriptions brief but impactful.
      Limit work experience to 3-4 most relevant positions, education to 2 most relevant degrees,
      and skills to 8-10 most important ones for the role.
      Ensure all content is professional and focused on key accomplishments.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional resume writer focused on creating concise, ATS-friendly content.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const enhancedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ enhancedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
