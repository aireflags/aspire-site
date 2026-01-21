import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000'
  const basePath = '/api/auth'

  return NextResponse.json({
    status: 'ok',
    message: 'Auth.js diagnostic information',
    configuration: {
      baseUrl,
      basePath,
      callbackUrl: `${baseUrl}${basePath}/callback/google`,
      signInUrl: `${baseUrl}${basePath}/signin/google`,
      expectedGoogleConsoleRedirectURI: `${baseUrl}${basePath}/callback/google`,
    },
    instructions: {
      step1: 'Go to https://console.cloud.google.com/apis/credentials',
      step2: 'Select your OAuth 2.0 Client ID',
      step3: 'Under "Authorized redirect URIs", add the callbackUrl shown above',
      step4: 'Save and restart your dev server',
    }
  })
}
