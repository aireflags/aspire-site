import NextAuth from "next-auth"
import Google, { type GoogleProfile } from "next-auth/providers/google"
import Lark, { type LarkProfile } from "@/lib/lark-provider"

function envList(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

const ALLOWED_TENANT_KEYS = envList("LARK_ALLOWED_TENANT_KEYS")
const ALLOWED_OPEN_IDS = envList("LARK_ALLOWED_OPEN_IDS")
const GOOGLE_ALLOWED_EMAILS = envList("GOOGLE_ALLOWED_EMAILS").map((value) =>
  value.toLowerCase(),
)
const GOOGLE_ALLOWED_DOMAINS = envList("GOOGLE_ALLOWED_DOMAINS").map((value) =>
  value.toLowerCase().replace(/^@/, ""),
)

const LARK_CONFIGURED = Boolean(
  process.env.LARK_CLIENT_ID && process.env.LARK_CLIENT_SECRET,
)
const GOOGLE_CONFIGURED = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(LARK_CONFIGURED
      ? [
          Lark({
            clientId: process.env.LARK_CLIENT_ID!,
            clientSecret: process.env.LARK_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(GOOGLE_CONFIGURED
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "lark") {
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
      }

      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile | undefined
        const email = googleProfile?.email?.trim().toLowerCase()
        const domain = email?.split("@").at(-1)

        if (!email || !domain || googleProfile?.email_verified !== true) {
          return "/welcome?error=AccessDenied"
        }

        if (
          GOOGLE_ALLOWED_EMAILS.length > 0 &&
          !GOOGLE_ALLOWED_EMAILS.includes(email)
        ) {
          return "/welcome?error=AccessDenied"
        }

        if (
          GOOGLE_ALLOWED_DOMAINS.length > 0 &&
          !GOOGLE_ALLOWED_DOMAINS.includes(domain)
        ) {
          return "/welcome?error=AccessDenied"
        }

        return true
      }

      return false
    },
    jwt({ token, user, account, profile }) {
      if (account) {
        token.id = account.providerAccountId
        token.provider = account.provider
        token.tenantKey =
          account.provider === "lark"
            ? (profile as LarkProfile | undefined)?.tenant_key
            : undefined
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
        session.user.provider =
          token.provider === "lark" || token.provider === "google"
            ? token.provider
            : undefined
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
