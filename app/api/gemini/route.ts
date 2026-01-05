import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

const USE_VERTEX_AI = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'True' || process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true'
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'

export async function POST(request: NextRequest) {
  // Vertex AI mode - requires service account credentials via GOOGLE_APPLICATION_CREDENTIALS
  // Note: Vertex AI does NOT support API keys, only service account credentials
  if (USE_VERTEX_AI) {
    if (!PROJECT_ID) {
      return NextResponse.json(
        { error: "Vertex AI is enabled but GOOGLE_CLOUD_PROJECT is not configured." },
        { status: 500 }
      )
    }
    
    // Check if GOOGLE_APPLICATION_CREDENTIALS is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { 
          error: "Vertex AI requires service account credentials. Please set GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your service account key file.",
          details: "Vertex AI does not support API keys. You need to: 1) Create a service account in Google Cloud Console, 2) Download the JSON key file, 3) Set GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json"
        },
        { status: 500 }
      )
    }
  } else {
    // Gemini API mode - requires API key
    const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!API_KEY) {
      return NextResponse.json(
        { error: "API Key is not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY in your environment." },
        { status: 500 }
      )
    }
  }

  try {
    const { userPrompt } = await request.json()

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: "Invalid request. userPrompt is required." },
        { status: 400 }
      )
    }

    // Configure GoogleGenAI for Vertex AI
    // Vertex AI uses Application Default Credentials (ADC) from GOOGLE_APPLICATION_CREDENTIALS
    // DO NOT pass apiKey when using Vertex AI - it only supports service account credentials
    const aiConfig: any = USE_VERTEX_AI
      ? { 
          project: PROJECT_ID,
          location: LOCATION,
        }
      : { 
          apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        }

    const ai = new GoogleGenAI(aiConfig)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "You are a professional financial Copilot for a Senior Broker named Alex. Provide concise, expert insights on market trends, compliance, and portfolio management. Always remain professional and helpful. Format your responses using Markdown (use **bold**, *italic*, - for lists, etc.). Keep responses under 200 words. Be concise and to the point.",
        temperature: 0.7,
      },
    })

    let responseText = response.text || "I'm sorry, I couldn't process that request."
    
    // Limit response to 200 words (count actual words, not characters)
    const words = responseText.trim().split(/\s+/).filter(word => word.length > 0)
    if (words.length > 200) {
      responseText = words.slice(0, 200).join(' ') + '...'
    }
    
    return NextResponse.json({ text: responseText })
  } catch (error) {
    console.error("Gemini API Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { 
        error: "Error: Unable to connect to the intelligence service. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

