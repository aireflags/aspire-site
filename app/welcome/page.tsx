'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  handleProviderSignIn,
  type SignInProvider,
} from './actions'

interface ConfigStatus {
  isValid: boolean
  loading: boolean
  providers: SignInProvider[]
}

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
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    isValid: false,
    loading: true,
    providers: [],
  })
  const [signingInProvider, setSigningInProvider] =
    useState<SignInProvider | null>(null)

  // Check configuration status
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/auth/config-status')
        const data = await response.json()
        const isValid = data.status === 'ok' && data.allSet

        const providers = Array.isArray(data.providers)
          ? data.providers.filter(
              (provider: unknown): provider is SignInProvider =>
                provider === 'lark' || provider === 'google'
            )
          : []

        setConfigStatus({ isValid, loading: false, providers })

        // Clear Configuration error if config is now valid
        if (isValid && error === 'Configuration') {
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('error')
          router.replace(newUrl.pathname + newUrl.search)
        }
      } catch (err) {
        console.error('Failed to check config:', err)
        setConfigStatus({ isValid: false, loading: false, providers: [] })
      }
    }

    checkConfig()
  }, [error, router])

  // Handle sign-in button click
  const handleSignIn = async (provider: SignInProvider) => {
    if (!configStatus.providers.includes(provider)) return

    setSigningInProvider(provider)
    try {
      await handleProviderSignIn(provider, callbackUrl)
    } catch (err) {
      console.error('Sign in error:', err)
      setSigningInProvider(null)
    }
  }

  // 错误消息映射
  const errorMessages: Record<string, string> = {
    Configuration: 'Configuration error: check AUTH_SECRET and the selected OAuth provider credentials.',
    AccessDenied: 'Access denied: this account is not authorized for the portal.',
    Verification: 'Account verification failed. Please try again.',
    OAuthAccountNotLinked: 'This email is already connected through a different sign-in method.',
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
            Sign in with an approved Lark or Google account to continue
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">⚠️ {errorMessage}</p>
            {error === 'Configuration' && (
              <p className="text-red-600 text-xs mt-2">
                Add the required server environment variables and restart the app.
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => handleSignIn('lark')}
          disabled={
            configStatus.loading ||
            !configStatus.providers.includes('lark') ||
            signingInProvider !== null
          }
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="#3370FF" />
            <path d="M7 6.5v8.2c0 1.55 1.25 2.8 2.8 2.8H17" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="16.6" cy="7.4" r="2.1" fill="#00D6B9" />
          </svg>
          <span className="text-gray-900 font-semibold">
            {signingInProvider === 'lark'
              ? 'Connecting to Lark...'
              : configStatus.loading || configStatus.providers.includes('lark')
                ? 'Sign in with Lark'
                : 'Lark login is not configured'}
          </span>
        </button>

        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={() => handleSignIn('google')}
          disabled={
            configStatus.loading ||
            !configStatus.providers.includes('google') ||
            signingInProvider !== null
          }
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.32 2.98-7.4Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.37l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.46H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.54l3.35-2.62Z" />
            <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.46l3.35 2.62C7.18 7.71 9.39 5.95 12 5.95Z" />
          </svg>
          <span className="text-gray-900 font-semibold">
            {signingInProvider === 'google'
              ? 'Connecting to Google...'
              : configStatus.loading || configStatus.providers.includes('google')
                ? 'Sign in with Google'
                : 'Google login is not configured'}
          </span>
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Access may be restricted by Lark tenant, Google domain, or individual account.
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
