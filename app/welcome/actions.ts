"use server"

import { signIn } from "@/auth"

export type SignInProvider = "lark" | "google"

export async function handleProviderSignIn(
  provider: SignInProvider,
  callbackUrl: string = "/home",
) {
  const redirectTo =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/home"

  await signIn(provider, {
    redirectTo,
  })
}
