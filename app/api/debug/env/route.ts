import { NextResponse } from 'next/server'

export async function GET() {
  // 检查环境变量是否存在（不显示实际值，只显示是否存在）
  const envCheck = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,

    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    AUTH_URL: !!process.env.AUTH_URL,
    AUTH_TRUST_HOST: !!process.env.AUTH_TRUST_HOST,


    // 显示部分值用于验证（只显示前几个字符）
    AUTH_SECRET_PREFIX: process.env.AUTH_SECRET ? `${process.env.AUTH_SECRET.substring(0, 4)}...` : 'NOT SET',
    GOOGLE_CLIENT_ID_PREFIX: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'NOT SET',
    GOOGLE_CLIENT_SECRET_PREFIX: process.env.GOOGLE_CLIENT_SECRET ? `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 4)}...` : 'NOT SET',
    GEMINI_API_KEY_PREFIX: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 4)}...` : 'NOT SET'
  }

  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    variables: envCheck,
    allSet: envCheck.AUTH_SECRET && envCheck.GOOGLE_CLIENT_ID && envCheck.GOOGLE_CLIENT_SECRET && envCheck.GEMINI_API_KEY && envCheck.AUTH_URL && envCheck.AUTH_TRUST_HOST,
  })
}


