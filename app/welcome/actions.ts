"use server"

import { signIn } from "@/auth"

export async function handleGoogleSignIn(callbackUrl: string = "/home") {
  await signIn("google", {
    redirectTo: callbackUrl,
  })
}
