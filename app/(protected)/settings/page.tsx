'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function SettingsPage() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ redirectTo: '/welcome' })
  }

  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Settings</h1>
        <div className="space-y-2">
          {[
            { icon: 'person', label: 'Profile Information' },
            { icon: 'security', label: 'Security & Privacy' },
            { icon: 'notifications', label: 'Notification Preferences' },
            { icon: 'language', label: 'Region & Language' },
            { icon: 'help', label: 'Support Center' },
          ].map((item, i) => (
            <button key={i} className="w-full p-4 rounded-xl bg-white border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full mt-8 p-4 rounded-xl border border-red-500/50 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing out...' : 'Log Out'}
        </button>
      </div>
    </main>
  )
}
