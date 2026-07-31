import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    LARK_CLIENT_ID: !!process.env.LARK_CLIENT_ID,
    LARK_CLIENT_SECRET: !!process.env.LARK_CLIENT_SECRET,
    LARK_ALLOWED_TENANT_KEYS: !!process.env.LARK_ALLOWED_TENANT_KEYS,
    LARK_ALLOWED_OPEN_IDS: !!process.env.LARK_ALLOWED_OPEN_IDS,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    GOOGLE_GENAI_USE_VERTEXAI: !!process.env.GOOGLE_GENAI_USE_VERTEXAI,
    GOOGLE_CLOUD_PROJECT: !!process.env.GOOGLE_CLOUD_PROJECT,
    GOOGLE_CLOUD_LOCATION: !!process.env.GOOGLE_CLOUD_LOCATION,
    AUTH_URL: !!process.env.AUTH_URL,
    AUTH_TRUST_HOST: !!process.env.AUTH_TRUST_HOST,
  }

  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    variables: envCheck,
    authConfigured:
      envCheck.AUTH_SECRET &&
      envCheck.LARK_CLIENT_ID &&
      envCheck.LARK_CLIENT_SECRET,
    geminiConfigured:
      envCheck.GEMINI_API_KEY ||
      (envCheck.GOOGLE_GENAI_USE_VERTEXAI &&
        envCheck.GOOGLE_CLOUD_PROJECT &&
        envCheck.GOOGLE_CLOUD_LOCATION),
  })
}
