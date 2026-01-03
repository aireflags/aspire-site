import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/home", "/aspireAI", "/offerMaker", "/settings"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // 检查是否为受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !isAuthenticated) {
    // 未登录用户重定向到 welcome 页面
    const welcomeUrl = new URL("/welcome", req.url)
    welcomeUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(welcomeUrl)
  }

  // 如果已登录用户访问 welcome 页面，重定向到 home
  if (pathname === "/welcome" && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", req.url))
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
