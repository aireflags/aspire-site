import { NextResponse } from 'next/server'

export async function GET() {
  const envStatus = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    LARK_CLIENT_ID: !!process.env.LARK_CLIENT_ID,
    LARK_CLIENT_SECRET: !!process.env.LARK_CLIENT_SECRET,
  }

  const hasValidConfig =
    envStatus.AUTH_SECRET &&
    envStatus.LARK_CLIENT_ID &&
    envStatus.LARK_CLIENT_SECRET

  return NextResponse.json({
    status: hasValidConfig ? 'ok' : 'error',
    message: hasValidConfig
      ? 'Lark authentication configuration is valid'
      : 'Authentication configuration error: missing required environment variables',
    environment: process.env.NODE_ENV,
    allSet: hasValidConfig,
    envStatus,
    providers: hasValidConfig ? ['lark'] : [],
  })
}
