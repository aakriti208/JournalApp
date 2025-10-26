// @deno-types="npm:@types/node"

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts';
import {z} from "zod";

const schema = z.object({
    message: z.string(),
    history: z.array(z.object({ role: z.string(), content: z.string() })),
    userName: z.string(),
})

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

// CORS headers allows React Native to call this function
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Edge function to receive the request sent by React Native

serve(async(req) => {
    // Handle CORS preflight requests
    if(req.method == 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }
    try {
        // GET request body and extract data from it
        const {message, history, userName} = schema.parse(await req.json());
        if(!message) {
            throw new Error("Message is required");
        }

        // Get Groq API key from environment
        const groqApiKey = Deno.env.get('GROQ_API_KEY');
        if(!groqApiKey) {
            throw new Error("GROQ_API_KEY not configured")
        }

        // create a prompt to tell the AI how to behave
        const systemPrompt = `You are a warm, empathetic journaling companion for ${userName}.
Your role:
- Ask thoughtful follow-up questions about their day
- Be encouraging and supportive  
- Keep responses conversational and concise (2-3 sentences max)
- Help them reflect on their experiences

Tone: Friendly, casual, like talking to a supportive friend.`
        
       
        // Build messages array for Groq
        const messages: Message[] = [
            {
                role: 'system', content: systemPrompt },
                ...(history as Message[]).slice(-6), // Only last 6 messages
                {role: 'user', content: message }
              ];

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: messages,
                temperature: 0.8,
                max_tokens: 200,
                top_p: 0.9,
            }),
    })
        if(!groqResponse.ok){
            const error = await groqResponse.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const data = await groqResponse.json();
        const aiResponse = data.choices[0].message.content;

    // return the response from Groq

    return new Response(
        JSON.stringify({
            response: aiResponse,
            model: 'llama-3.1-8b-instant'
        }),
        {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json' 
            }
        }
    )
        }
    // handle any errors 
catch(error) {
        console.error('Error', error);
    
    return new Response(
        JSON.stringify({error: error.message}),
        {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json' 
            }

        }
    )}
})

