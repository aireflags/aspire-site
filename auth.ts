import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// 允许的邮箱域名列表
const ALLOWED_EMAIL_DOMAINS = [
  "aspirehomesrealty.com",
  "gmail.com",
  "ratednagroup.com"
]

// 验证必需的环境变量（在构建时和运行时都会检查）
const AUTH_SECRET = process.env.AUTH_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (!AUTH_SECRET) {
  console.error('❌ AUTH_SECRET 环境变量未设置')
  console.error('   请确保在 Vercel 项目设置中添加 AUTH_SECRET 环境变量')
}

if (!GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID 环境变量未设置')
  console.error('   请确保在 Vercel 项目设置中添加 GOOGLE_CLIENT_ID 环境变量')
}

if (!GOOGLE_CLIENT_SECRET) {
  console.error('❌ GOOGLE_CLIENT_SECRET 环境变量未设置')
  console.error('   请确保在 Vercel 项目设置中添加 GOOGLE_CLIENT_SECRET 环境变量')
}

// 如果缺少任何必需的环境变量，在开发环境中抛出错误
if (process.env.NODE_ENV === 'development' && (!AUTH_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)) {
  console.error('⚠️  缺少必需的环境变量，NextAuth 可能无法正常工作')
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID || '',
      clientSecret: GOOGLE_CLIENT_SECRET || '',
    }),
  ],
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
  secret: AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

