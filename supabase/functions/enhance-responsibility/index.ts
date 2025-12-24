
// @ts-ignore: Deno types are implicit in this environment
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { text, jobTitle } = await req.json();

        if (!text) {
            throw new Error('Text input is required');
        }

        const prompt = `Input Text: "${text}"
Context/Job Title: "${jobTitle || 'General Professional'}"

Return ONLY the rewritten bullet point text. Do not output any conversational filler or "Here is the rewritten version" prefixes.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                // @ts-ignore: Deno env is available in Supabase runtime
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert Resume Strategist and ATS Optimization Specialist.
            Your task is to rewrite a user's rough bullet point into a "Top Tier" resume achievement.
            
            Follow these strict rules:
            1. Action-First: Start with a strong power verb (e.g., spearheaded, engineered, orchestrated).
            2. Quantify Results: If possible, infer impact or emphasize scope/scale.
            3. ATS Keywords: Use industry-standard terminology.
            4. XYZ Formula: Structure as "Accomplished [X]... by doing [Z]".
            5. Conciseness: Maximum 2 sentences.`
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const enhancedText = data.choices[0].message.content;

        return new Response(JSON.stringify({ enhancedText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error in enhance-responsibility function:', error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
