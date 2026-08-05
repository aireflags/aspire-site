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
      providers: {
        lark: {
          callbackUrl: `${baseUrl}${basePath}/callback/lark`,
          signInUrl: `${baseUrl}${basePath}/signin/lark`,
        },
        google: {
          callbackUrl: `${baseUrl}${basePath}/callback/google`,
          signInUrl: `${baseUrl}${basePath}/signin/google`,
        },
      },
    },
    instructions: {
      lark: 'Add the exact Lark callbackUrl to Lark Developer Console > Development Configuration > Security Settings.',
      google: 'Add the exact Google callbackUrl to Google Cloud Console > OAuth client > Authorized redirect URIs.',
      final: 'Save the provider settings and restart your development server.',
    }
  })
}
