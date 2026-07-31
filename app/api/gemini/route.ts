import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash'

export async function POST(request: Request) {
  const useVertex =
    process.env.GOOGLE_GENAI_USE_VERTEXAI?.toLowerCase() === 'true'

  let message = ''
  try {
    const body = await request.json()
    message = typeof body?.message === 'string' ? body.message.trim() : ''
  } catch {
    message = ''
  }

  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  try {
    let ai: GoogleGenAI

    if (useVertex) {
      const project =
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT ||
        process.env.GCP_PROJECT
      const location =
        process.env.GOOGLE_CLOUD_LOCATION ||
        process.env.GOOGLE_CLOUD_REGION ||
        process.env.GCLOUD_REGION ||
        'us-central1'

      if (!project) {
        return NextResponse.json({
          text:
            'Vertex AI is not configured. Set GOOGLE_CLOUD_PROJECT (or GCLOUD_PROJECT/GCP_PROJECT) and try again.'
        })
      }

      ai = new GoogleGenAI({
        vertexai: true,
        project,
        location
      })
    } else {
      const apiKey = process.env.GEMINI_API_KEY

      if (!apiKey) {
        return NextResponse.json({
          text: 'API Key is not configured. Please check your environment.'
        })
      }

      ai = new GoogleGenAI({ apiKey })
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ]
    })

    const text =
      typeof response.text === 'string' && response.text.trim().length > 0
        ? response.text.trim()
        : 'Sorry, I could not generate a response.'

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Unable to connect to Gemini API.' },
      { status: 500 }
    )
  }
}
