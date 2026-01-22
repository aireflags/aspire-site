'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { handleGoogleSignIn } from './actions'

export default function WelcomePage() {
  return (
    <Suspense fallback={<WelcomeFallback />}>
      <WelcomeContent />
    </Suspense>
  )
}

function WelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/home'
  const error = searchParams.get('error')
  const [configStatus, setConfigStatus] = useState<{ isValid: boolean; loading: boolean }>({ isValid: false, loading: true })
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Check configuration status
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/auth/providers')
        const data = await response.json()
        const isValid = data.status === 'ok' && data.allSet

        setConfigStatus({ isValid, loading: false })

        // Clear Configuration error if config is now valid
        if (isValid && error === 'Configuration') {
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('error')
          router.replace(newUrl.pathname + newUrl.search)
        }
      } catch (err) {
        console.error('Failed to check config:', err)
        setConfigStatus({ isValid: false, loading: false })
      }
    }

    checkConfig()
  }, [error, router])

  // Handle sign-in button click
  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await handleGoogleSignIn(callbackUrl)
    } catch (err) {
      console.error('Sign in error:', err)
      setIsSigningIn(false)
    }
  }

  // 错误消息映射
  const errorMessages: Record<string, string> = {
    Configuration: '配置错误：请检查环境变量设置（AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET）',
    AccessDenied: '访问被拒绝：您的邮箱域名不在允许列表中',
    Verification: '验证失败：请重试',
    Default: '登录失败：请稍后重试'
  }

  // 只有在配置确实有问题时才显示错误
  const shouldShowError = error && !(error === 'Configuration' && configStatus.isValid)
  const errorMessage = shouldShowError ? (errorMessages[error!] || errorMessages.Default) : null

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto items-center justify-center px-6">
      <div className="text-center space-y-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Aspire Homes
          </h1>
          <p className="text-gray-500">
            Sign in with your company email to continue
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">⚠️ {errorMessage}</p>
            {error === 'Configuration' && (
              <p className="text-red-600 text-xs mt-2">
                请在 Vercel 项目设置中添加必需的环境变量
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-900 font-semibold">
            {isSigningIn ? '正在登录...' : '使用 Google 登录'}
          </span>
        </button>

        <p className="text-sm text-gray-400 mt-4">
          使用 Google 账户登录（支持 Gmail 和企业邮箱）
        </p>
      </div>
    </div>
  )
}

function WelcomeFallback() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto items-center justify-center px-6">
      <div className="text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )
}
