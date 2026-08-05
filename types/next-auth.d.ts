import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      tenantKey?: string
      provider?: "lark" | "google"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    tenantKey?: string
    provider?: string
  }
}
