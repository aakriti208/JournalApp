import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create } from 'react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const {entryContent, entryId} = await req.json();
    if(!entryContent || !entryId) {
      throw new Error("entryContent and entryId are required")
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if(!groqApiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const prompt = `Analyze this journal entry and extract structured information.
    Journal Entry:
"${entryContent}"

Extract and return ONLY a valid JSON object with this exact structure:
{
  "mood_score": <number from -5 (very negative) to 5 (very positive)>,
  "topics": [<array of key topics/themes mentioned>],
  "people": [<array of people's names mentioned>],
  "places": [<array of locations mentioned>]
}

Rules:
- mood_score must be an integer between -5 and 5
- Return empty arrays if nothing found
- Only return the JSON object, no other text`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,  // Lower temp for more consistent JSON
        max_tokens: 300,
      }),
    });
      
    if(!groqResponse.ok) {
      const error = await groqResponse.text();
      throw new Error(`Groq API error: ${error}`);
    }
  } catch(error){

  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-entry' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
