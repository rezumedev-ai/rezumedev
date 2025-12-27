
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

        const prompt = `Transform this responsibility into a FAANG-caliber achievement:

INPUT: "${text}"
JOB CONTEXT: ${jobTitle || 'Professional Role'}

CRITICAL: Stay true to the user's original intent and scope. Don't fabricate achievements they didn't mention.`;

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
                        content: `You are an elite Resume Strategist who has helped hundreds of candidates land roles at FAANG companies (Google, Meta, Amazon, Apple, Netflix, Microsoft).

Your mission: Transform basic responsibility descriptions into compelling, FAANG-level achievement statements.

CORE PRINCIPLES:
1. AUTHENTICITY FIRST: Enhance what the user wrote, don't invent new achievements
2. IMPACT-DRIVEN: Emphasize business value, user impact, and measurable outcomes
3. TECHNICAL PRECISION: Use industry-standard terminology and technical depth
4. LEADERSHIP SIGNALS: Highlight ownership, initiative, and cross-functional collaboration
5. QUANTIFICATION: Add scope/scale indicators (team size, users, systems, timeframes)

POWER VERB ROTATION (use diverse verbs to avoid repetition):
• Leadership: Spearheaded, Orchestrated, Pioneered, Championed, Drove
• Technical: Architected, Engineered, Designed, Implemented, Optimized
• Impact: Transformed, Revolutionized, Streamlined, Accelerated, Scaled
• Collaboration: Partnered, Coordinated, Facilitated, Aligned, Integrated
• Innovation: Innovated, Modernized, Evolved, Rebuilt, Reimagined

STRUCTURE FORMULAS (alternate between these):
A) [Action Verb] + [What You Built/Did] + [Technical Method] + [Business Impact]
   Example: "Architected microservices platform using Kubernetes, reducing deployment time by 60%"

B) [Impact/Result] + by/through + [Action & Method]
   Example: "Improved user engagement by 40% through redesigning onboarding flow with A/B testing"

C) [Action Verb] + [Scope] + [What] + resulting in [Quantified Impact]
   Example: "Led cross-functional team of 8 engineers to migrate legacy system, resulting in 99.9% uptime"

FAANG EXCELLENCE MARKERS:
✓ Quantify impact (%, $, time, users, scale)
✓ Show technical depth (specific technologies, methodologies)
✓ Demonstrate scope (team size, system scale, user base)
✓ Highlight collaboration (cross-functional, stakeholder management)
✓ Emphasize outcomes over activities

QUALITY STANDARDS:
• Maximum 2 sentences (prefer 1 impactful sentence)
• Start with a strong, varied power verb
• Include at least one metric or scope indicator
• Use active voice, past tense
• Be specific, not generic
• ATS-optimized with industry keywords

OUTPUT: Return ONLY the polished bullet point. No preamble, no "Here's the rewritten version", just the enhanced text.`
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.85,
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
