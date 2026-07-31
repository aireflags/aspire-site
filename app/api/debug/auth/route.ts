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
      callbackUrl: `${baseUrl}${basePath}/callback/lark`,
      signInUrl: `${baseUrl}${basePath}/signin/lark`,
      expectedLarkRedirectUrl: `${baseUrl}${basePath}/callback/lark`,
    },
    instructions: {
      step1: 'Open the app in the Lark Developer Console',
      step2: 'Go to Development Configuration > Security Settings',
      step3: 'Add the exact callbackUrl shown above to Redirect URLs',
      step4: 'Save and restart your dev server',
    }
  })
}
