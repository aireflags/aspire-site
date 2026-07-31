import { NextResponse } from "next/server"
import { auth } from "@/auth"

const protectedRoutes = ["/home", "/aspireAI", "/offerMaker", "/settings"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users to welcome page
    const welcomeUrl = new URL("/welcome", req.url)
    welcomeUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(welcomeUrl)
  }

  // If authenticated user visits welcome page, redirect to callback or home
  if (pathname === "/welcome" && isAuthenticated) {
    const requestedCallback =
      req.nextUrl.searchParams.get("callbackUrl") || "/home"
    const callbackUrl =
      requestedCallback.startsWith("/") && !requestedCallback.startsWith("//")
        ? requestedCallback
        : "/home"
    return NextResponse.redirect(new URL(callbackUrl, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
