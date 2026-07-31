import NextAuth from "next-auth"
import Lark, { type LarkProfile } from "@/lib/lark-provider"

function envList(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

const ALLOWED_TENANT_KEYS = envList("LARK_ALLOWED_TENANT_KEYS")
const ALLOWED_OPEN_IDS = envList("LARK_ALLOWED_OPEN_IDS")

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Lark({
      clientId: process.env.LARK_CLIENT_ID ?? "",
      clientSecret: process.env.LARK_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "lark") {
        return false
      }

      const larkProfile = profile as LarkProfile | undefined
      if (!larkProfile?.open_id) {
        return "/welcome?error=AccessDenied"
      }

      if (
        ALLOWED_TENANT_KEYS.length > 0 &&
        (!larkProfile.tenant_key ||
          !ALLOWED_TENANT_KEYS.includes(larkProfile.tenant_key))
      ) {
        return "/welcome?error=AccessDenied"
      }

      if (
        ALLOWED_OPEN_IDS.length > 0 &&
        !ALLOWED_OPEN_IDS.includes(larkProfile.open_id)
      ) {
        return "/welcome?error=AccessDenied"
      }

      return true
    },
    jwt({ token, user, account, profile }) {
      if (account?.provider === "lark") {
        token.id = account.providerAccountId
        token.tenantKey = (profile as LarkProfile | undefined)?.tenant_key
      } else if (user) {
        token.id = user.id
      }

      if (user?.email) {
        token.email = user.email
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tenantKey =
          typeof token.tenantKey === "string" ? token.tenantKey : undefined
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
  trustHost: true,
})
