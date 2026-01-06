'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/home')
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 max-w-md mx-auto items-center justify-center px-6">
      <div className="text-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  )
}
