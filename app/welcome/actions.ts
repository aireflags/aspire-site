"use server"

import { signIn } from "@/auth"

export async function handleLarkSignIn(callbackUrl: string = "/home") {
  const redirectTo =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/home"

  await signIn("lark", {
    redirectTo,
  })
}
