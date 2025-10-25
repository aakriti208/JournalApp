// @deno-types="npm:@types/node"

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts'

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async(req) => {
    if(req.method == 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }
    try {
        const {message, history, userName} = await req.json();
        if(!message) {
            throw new Error("Message is required");
        }

        const groqApiKey = Deno.env.get('GROQ-API-KEY');
        if(!groqApiKey) {
            throw new Error("GROQ-API-KEY not configured")
        }

        const systemPrompt = `You are a warm, empathetic journaling companion for ${userName}.
Your role:
- Ask thoughtful follow-up questions about their day
- Be encouraging and supportive  
- Keep responses conversational and concise (2-3 sentences max)
- Help them reflect on their experiences

Tone: Friendly, casual, like talking to a supportive friend.`
        
       

        const messages = Message[] = [
            {
                role: 'system', content: systemPrompt },
                ...history.slice(-6), // Only last 6 messages
                { role: 'user', content: message }
              ]

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
    }),
        if(!groqResponse.ok){
            const error = await groqResponse.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const data = await groqResponse.json();
        const aiResponse = data.choices[0].message.content;

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


export async function handler(req){

    const {message, history, userName} = await req.json();
    
    if(!message) {
        throw new Error("Message is required");
    }
    }

