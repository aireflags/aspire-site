import { NextResponse } from 'next/server'
import { authConfig } from '@/auth'

export async function GET() {
  // 检查环境变量
  const envStatus = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  }

  // 检查配置是否有效
  const hasValidConfig = envStatus.AUTH_SECRET && envStatus.GOOGLE_CLIENT_ID && envStatus.GOOGLE_CLIENT_SECRET

  return NextResponse.json({
    status: hasValidConfig ? 'ok' : 'error',
    message: hasValidConfig 
      ? 'NextAuth 配置正常' 
      : 'NextAuth 配置错误：缺少必需的环境变量',
    environment: process.env.NODE_ENV,
    envStatus,
    providers: hasValidConfig ? ['google'] : [],
    config: {
      hasAuthSecret: envStatus.AUTH_SECRET,
      hasGoogleClientId: envStatus.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: envStatus.GOOGLE_CLIENT_SECRET,
    }
  })
}


