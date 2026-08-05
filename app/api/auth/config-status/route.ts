import { NextResponse } from 'next/server'

export async function GET() {
  const envStatus = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    LARK_CLIENT_ID: !!process.env.LARK_CLIENT_ID,
    LARK_CLIENT_SECRET: !!process.env.LARK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  }

  const providerStatus = {
    lark: envStatus.LARK_CLIENT_ID && envStatus.LARK_CLIENT_SECRET,
    google: envStatus.GOOGLE_CLIENT_ID && envStatus.GOOGLE_CLIENT_SECRET,
  }
  const configuredProviders = Object.entries(providerStatus)
    .filter(([, configured]) => configured)
    .map(([provider]) => provider)
  const hasValidConfig =
    envStatus.AUTH_SECRET && configuredProviders.length > 0

  return NextResponse.json({
    status: hasValidConfig ? 'ok' : 'error',
    message: hasValidConfig
      ? 'Authentication configuration is valid'
      : 'Authentication configuration error: set AUTH_SECRET and at least one complete OAuth provider',
    environment: process.env.NODE_ENV,
    allSet: hasValidConfig,
    envStatus,
    providers: configuredProviders,
    providerStatus,
  })
}
