'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { handleLarkSignIn } from './actions'

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
        const response = await fetch('/api/auth/config-status')
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
      await handleLarkSignIn(callbackUrl)
    } catch (err) {
      console.error('Sign in error:', err)
      setIsSigningIn(false)
    }
  }

  // 错误消息映射
  const errorMessages: Record<string, string> = {
    Configuration: 'Configuration error: check AUTH_SECRET, LARK_CLIENT_ID, and LARK_CLIENT_SECRET.',
    AccessDenied: 'Access denied: your Lark account is not authorized for this portal.',
    Verification: 'Lark verification failed. Please try again.',
    Default: 'Sign-in failed. Please try again.'
  }

  // 只有在配置确实有问题时才显示错误
  const shouldShowError = error && !(error === 'Configuration' && configStatus.isValid)
  const errorMessage = shouldShowError ? (errorMessages[error!] || errorMessages.Default) : null

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto items-center justify-center px-6">
      <div className="text-center space-y-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Aspire Homes Portal
          </h1>
          <p className="text-gray-500">
            Sign in with your Aspire Lark account to continue
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">⚠️ {errorMessage}</p>
            {error === 'Configuration' && (
              <p className="text-red-600 text-xs mt-2">
                Add the required authentication variables in Vercel and redeploy.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="#3370FF" />
            <path d="M7 6.5v8.2c0 1.55 1.25 2.8 2.8 2.8H17" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="16.6" cy="7.4" r="2.1" fill="#00D6B9" />
          </svg>
          <span className="text-gray-900 font-semibold">
            {isSigningIn ? 'Connecting to Lark...' : 'Sign in with Lark'}
          </span>
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Use the Lark account provided by your organization.
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
