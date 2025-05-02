
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate random codes
function generateRandomCode(length: number): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

// Function to generate unique codes
async function generateUniqueCodes(
  count: number, 
  codeLength: number, 
  supabaseUrl: string, 
  supabaseKey: string
): Promise<string[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const codes: Set<string> = new Set();
  
  // Get all existing codes to avoid duplicates
  const { data: existingCodes } = await supabase
    .from('redemption_codes')
    .select('code');
  
  const existingCodesSet = new Set((existingCodes || []).map(item => item.code));

  // Generate unique codes
  while (codes.size < count) {
    const newCode = generateRandomCode(codeLength);
    if (!codes.has(newCode) && !existingCodesSet.has(newCode)) {
      codes.add(newCode);
    }
  }
  
  return Array.from(codes);
}

// Function to insert codes into database
async function insertCodesIntoDatabase(
  codes: string[], 
  supabaseUrl: string, 
  supabaseKey: string
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Insert codes in batches to avoid payload size limitations
  const batchSize = 100;
  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize).map(code => ({
      code,
      source: 'appsumo'
    }));
    
    await supabase.from('redemption_codes').insert(batch);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get parameters from request
    const { count = 1000, codeLength = 10, generateCsv = true, insertIntoDb = true } = await req.json();
    
    // Validation
    if (count < 1 || count > 10000) {
      throw new Error('Count must be between 1 and 10,000');
    }
    
    if (codeLength < 6 || codeLength > 20) {
      throw new Error('Code length must be between 6 and 20 characters');
    }
    
    console.log(`Generating ${count} codes with length ${codeLength}...`);
    
    // Generate codes
    const codes = await generateUniqueCodes(count, codeLength, supabaseUrl, supabaseKey);
    
    // Insert into database if requested
    if (insertIntoDb) {
      await insertCodesIntoDatabase(codes, supabaseUrl, supabaseKey);
      console.log(`Inserted ${codes.length} codes into the database`);
    }
    
    // Generate CSV if requested
    if (generateCsv) {
      const csvContent = codes.join('\n');
      return new Response(csvContent, { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="appsumo-codes-${new Date().toISOString().split('T')[0]}.csv"`
        } 
      });
    } else {
      return new Response(JSON.stringify({ success: true, count: codes.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error generating codes:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
