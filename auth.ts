import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// 允许的邮箱域名列表
const ALLOWED_EMAIL_DOMAINS = [
  "aspirehomesrealty.com",
  "gmail.com",
  "ratednagroup.com"
]

// 验证必需的环境变量（在构建时和运行时都会检查）
const AUTH_SECRET = process.env.AUTH_SECRET?.trim()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim()
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim()

// 检查环境变量是否存在且非空
const hasAuthSecret = !!AUTH_SECRET && AUTH_SECRET.length > 0
const hasGoogleClientId = !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 0
const hasGoogleClientSecret = !!GOOGLE_CLIENT_SECRET && GOOGLE_CLIENT_SECRET.length > 0

if (!hasAuthSecret) {
  console.error('❌ AUTH_SECRET 环境变量未设置或为空')
  console.error('   请确保在 Vercel 项目设置中添加 AUTH_SECRET 环境变量')
}

if (!hasGoogleClientId) {
  console.error('❌ GOOGLE_CLIENT_ID 环境变量未设置或为空')
  console.error('   请确保在 Vercel 项目设置中添加 GOOGLE_CLIENT_ID 环境变量')
}

if (!hasGoogleClientSecret) {
  console.error('❌ GOOGLE_CLIENT_SECRET 环境变量未设置或为空')
  console.error('   请确保在 Vercel 项目设置中添加 GOOGLE_CLIENT_SECRET 环境变量')
}

// 如果缺少任何必需的环境变量，记录警告
if (!hasAuthSecret || !hasGoogleClientId || !hasGoogleClientSecret) {
  console.error('⚠️  缺少必需的环境变量，NextAuth 可能无法正常工作')
}

// 只有在所有环境变量都存在时才配置 Google provider
const providers = []
if (hasGoogleClientId && hasGoogleClientSecret) {
  providers.push(
    Google({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    })
  )
} else {
  console.error('⚠️  Google provider 未配置：缺少 GOOGLE_CLIENT_ID 或 GOOGLE_CLIENT_SECRET')
}

export const authConfig: NextAuthConfig = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email || profile?.email
        console.log("🔍 Sign in attempt - Email:", email)
        
        if (email) {
          // 检查邮箱是否属于允许的域名
          const emailDomain = email.split('@')[1]?.toLowerCase()
          console.log("🔍 Email domain:", emailDomain)
          console.log("🔍 Allowed domains:", ALLOWED_EMAIL_DOMAINS)
          
          if (emailDomain && ALLOWED_EMAIL_DOMAINS.includes(emailDomain)) {
            console.log("✅ Access granted for domain:", emailDomain)
            return true
          } else {
            console.log("❌ Access denied - domain not in allowed list:", emailDomain)
          }
        } else {
          console.log("❌ Access denied - no email found")
        }
        return false // 拒绝非允许域名的用户
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: "/welcome",
    error: "/welcome",
  },
  session: {
    strategy: "jwt",
  },
  secret: hasAuthSecret ? AUTH_SECRET : undefined,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

