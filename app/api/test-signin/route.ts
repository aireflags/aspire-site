import { signIn } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use the programmatic signIn function
    await signIn("lark", {
      redirectTo: "/home",
    })

    return NextResponse.json({ status: "redirecting" })
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error?.message || "Unknown error",
      error: JSON.stringify(error, Object.getOwnPropertyNames(error))
    }, { status: 500 })
  }
}
