
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const getCorsHeaders = (origin: string | null) => {
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
  ]

  // Also allow origins from environment variable
  const envAllowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || []
  const allAllowedOrigins = [...allowedOrigins, ...envAllowedOrigins]

  // Default to the first allowed origin if no match
  let responseOrigin = allAllowedOrigins[0]

  if (origin && allAllowedOrigins.includes(origin)) {
    responseOrigin = origin
  }

  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY environment variable')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Inspired Concierge, a helpful AI assistant for community leaders. Keep responses concise and helpful." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'm ready to assist community leaders with concise and helpful guidance." }],
        },
      ],
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
