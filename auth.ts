import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// 允许的邮箱域名列表
const ALLOWED_EMAIL_DOMAINS = [
  "aspirehomesrealty.com",
  "gmail.com",
  "ratednagroup.com"
]

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
  secret: process.env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

