import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    LARK_CLIENT_ID: !!process.env.LARK_CLIENT_ID,
    LARK_CLIENT_SECRET: !!process.env.LARK_CLIENT_SECRET,
    LARK_ALLOWED_TENANT_KEYS: !!process.env.LARK_ALLOWED_TENANT_KEYS,
    LARK_ALLOWED_OPEN_IDS: !!process.env.LARK_ALLOWED_OPEN_IDS,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_ALLOWED_DOMAINS: !!process.env.GOOGLE_ALLOWED_DOMAINS,
    GOOGLE_ALLOWED_EMAILS: !!process.env.GOOGLE_ALLOWED_EMAILS,
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
    authConfigured: Boolean(
      envCheck.AUTH_SECRET &&
        ((envCheck.LARK_CLIENT_ID && envCheck.LARK_CLIENT_SECRET) ||
          (envCheck.GOOGLE_CLIENT_ID && envCheck.GOOGLE_CLIENT_SECRET)),
    ),
    providers: {
      lark: envCheck.LARK_CLIENT_ID && envCheck.LARK_CLIENT_SECRET,
      google: envCheck.GOOGLE_CLIENT_ID && envCheck.GOOGLE_CLIENT_SECRET,
    },
    geminiConfigured:
      envCheck.GEMINI_API_KEY ||
      (envCheck.GOOGLE_GENAI_USE_VERTEXAI &&
        envCheck.GOOGLE_CLOUD_PROJECT &&
        envCheck.GOOGLE_CLOUD_LOCATION),
  })
}
