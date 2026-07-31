'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSession } from 'next-auth/react'
import { ChatMessage } from '@/types'

export default function AspireAIPage() {
  const { data: session } = useSession()
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const displayName =
    session?.user?.name ||
    session?.user?.email?.split('@')[0] ||
    'there'
  const avatarUrl = session?.user?.image || 'https://picsum.photos/seed/alex/100/100'

  const commonQuestions = [
    "Who should pay for transfer tax in Santa Clara county?",
    "I made a non contingent offer but found that seller didn't disclose an unpermitted room addition, can we cancel the contract and get EMD back?"
  ]

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isProcessing])

  const handleSend = async (question?: string) => {
    const messageToSend = question || input.trim()
    if (!messageToSend || isProcessing) return

    setInput('')
    setIsProcessing(true)
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }])

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageToSend })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage =
          typeof data?.error === 'string' && data.error.trim().length > 0
            ? data.error.trim()
            : 'Error: Unable to connect to the intelligence service. Please try again later.'
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
        return
      }

      const aiResponse =
        typeof data?.text === 'string' && data.text.trim().length > 0
          ? data.text.trim()
          : 'Sorry, I could not generate a response.'

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Error: Unable to connect to the intelligence service. Please try again later.'
        }
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto pb-20 bg-white">
      <div className="flex flex-col">
        {/* Header - Greeting and Notification */}
        <header className="flex items-center justify-between p-4 pb-2 bg-white sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-gray-200" 
              style={{ backgroundImage: `url("${avatarUrl}")` }}
            />
            <div className="flex flex-col">
              <h2 className="text-gray-900 text-lg font-bold leading-tight">Good morning, {displayName}</h2>
              <p className="text-gray-500 text-sm font-medium">AspireAI</p>
            </div>
          </div>
          <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-100 transition-colors relative">
            <span className="material-symbols-outlined text-gray-900" style={{ fontSize: '24px' }}>notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Main Content - Chat Messages */}
        <div 
          className="px-4 py-4 pb-32 space-y-4"
        >
          {messages.length === 0 && (
            <div className="py-8 space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-2">Get started with these common questions:</p>
              </div>
              <div className="space-y-3">
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question)}
                    disabled={isProcessing}
                    className="w-full text-left p-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="text-gray-900 text-sm font-medium">{question}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}>
                {m.role === 'user' ? (
                  m.content
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-1.5 last:mb-0 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-1.5 last:mb-0 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="ml-0">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl text-sm rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Field at bottom */}
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-2 bg-white/80 backdrop-blur-md">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 shrink-0">
              <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
            </div>
            <input 
              className="bg-transparent border-none focus:ring-0 text-gray-900 text-base flex-1 min-w-0 placeholder-gray-400" 
              placeholder="Welcome! How can I help you today?" 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={isProcessing || !input.trim()}
                className={`flex items-center justify-center h-8 px-3 rounded-lg text-white text-sm font-bold shadow transition-colors ${
                  isProcessing || !input.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
                }`}
              >
                {isProcessing ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
