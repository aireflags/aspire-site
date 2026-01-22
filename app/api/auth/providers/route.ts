import { NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables
  const envStatus = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  }

  // Check if all required config is set
  const hasValidConfig = envStatus.AUTH_SECRET && envStatus.GOOGLE_CLIENT_ID && envStatus.GOOGLE_CLIENT_SECRET

  return NextResponse.json({
    status: hasValidConfig ? 'ok' : 'error',
    message: hasValidConfig
      ? 'NextAuth configuration is valid'
      : 'NextAuth configuration error: missing required environment variables',
    environment: process.env.NODE_ENV,
    allSet: hasValidConfig,
    envStatus,
    providers: hasValidConfig ? ['google'] : [],
  })
}

