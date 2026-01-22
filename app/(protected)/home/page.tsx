'use client'

import { useSession } from 'next-auth/react'
import { ENTERPRISE_TOOLS } from '@/constants'
import ToolCard from '../../components/ToolCard'

export default function HomePage() {
  const { data: session } = useSession()
  const displayName =
    session?.user?.name ||
    session?.user?.email?.split('@')[0] ||
    'there'
  const avatarUrl = session?.user?.image || 'https://picsum.photos/seed/alex/100/100'

  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 pb-2 bg-white sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-gray-200" 
              style={{ backgroundImage: `url("${avatarUrl}")` }}
            />
            <div className="flex flex-col">
              <h2 className="text-gray-900 text-lg font-bold leading-tight">Good morning, {displayName}</h2>
              <p className="text-gray-500 text-sm font-medium">aspire home</p>
            </div>
          </div>
          <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-100 transition-colors relative">
            <span className="material-symbols-outlined text-gray-900" style={{ fontSize: '24px' }}>notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Main Content */}
        <div className="px-4">
          <div className="pt-4 pb-3">
            <h1 className="text-gray-900 text-[22px] font-bold leading-tight tracking-tight">Enterprise Tools</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ENTERPRISE_TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
