'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/aspireAI', icon: 'auto_awesome', label: 'AspireAI' },
    { path: '/offerMaker', icon: 'edit_note', label: 'OfferMate' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ]

  return (
    <nav className="flex border-t border-gray-200 bg-white pt-2 pb-6 px-6">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex-1 flex flex-col items-center justify-end gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

