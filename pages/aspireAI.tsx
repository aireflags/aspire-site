
import React, { useState, useRef, useEffect } from 'react';
import { generateCopilotResponse } from '../services/gemini';
import { ChatMessage } from '../types';

const AspireAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const commonQuestions = [
    "How is the brokerage structured?",
    "Can you walk me through the full transaction process from first contact to closing?",
    "What does the onboarding and training timeline look like?",
    "Which CRM systems are mandatory?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageToSend = question || input.trim();
    if (!messageToSend || isProcessing) return;

    setInput('');
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);

    const aiResponse = await generateCopilotResponse(messageToSend);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col">
      {/* Header - Greeting and Notification */}
      <header className="flex items-center justify-between p-4 pb-2 bg-background-dark sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-[#3b4754]" 
            style={{ backgroundImage: 'url("https://picsum.photos/seed/alex/100/100")' }}
          />
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-bold leading-tight">Good morning, Liz</h2>
            <p className="text-[#9dabb9] text-sm font-medium">Newbie Agent</p>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 hover:bg-[#283039] transition-colors relative">
          <span className="material-symbols-outlined text-white text-2xl">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-background-dark"></span>
        </button>
      </header>

      {/* Main Content - Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="px-4 py-4 pb-32 space-y-4"
      >
        {messages.length === 0 && (
          <div className="py-8 space-y-4">
            <div className="text-center mb-6">
              <p className="text-[#9dabb9] text-sm mb-2">Get started with these common questions:</p>
            </div>
            <div className="space-y-3">
              {commonQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  disabled={isProcessing}
                  className="w-full text-left p-4 rounded-xl bg-[#1c2127] border border-[#3b4754] hover:bg-[#283039] hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="text-white text-sm font-medium">{question}</p>
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
              : 'bg-[#283039] text-white rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-[#283039] px-4 py-2 rounded-2xl text-sm rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field at bottom */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-2 bg-background-dark/80 backdrop-blur-md">
        <div className="bg-[#1c2127] border border-[#3b4754] rounded-xl shadow-lg p-2 flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 shrink-0">
            <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
          </div>
          <input 
            className="bg-transparent border-none focus:ring-0 text-white text-base flex-1 min-w-0 placeholder-[#9dabb9]" 
            placeholder="Welcome! How can I help you today?" 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <div className="flex items-center gap-1">
            <button className="p-2 text-[#9dabb9] hover:bg-[#283039] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={isProcessing || !input.trim()}
              className={`flex items-center justify-center h-8 px-3 rounded-lg text-white text-sm font-bold shadow transition-colors ${
                isProcessing || !input.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'
              }`}
            >
              {isProcessing ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspireAI;
