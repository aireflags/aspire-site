
import React, { useState, useRef, useEffect } from 'react';
import { generateCopilotResponse } from '../services/gemini';
import { ChatMessage } from '../types';

const CopilotBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput('');
    setIsProcessing(true);
    setIsOpen(true);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    const aiResponse = await generateCopilotResponse(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsProcessing(false);
  };

  return (
    <div className="px-4 pb-2 bg-background-dark/80 backdrop-blur-md">
      {/* Mini Chat Overlay */}
      {isOpen && (
        <div className="fixed bottom-36 left-4 right-4 max-w-[calc(100%-2rem)] max-h-[60vh] bg-[#1c2127] border border-[#3b4754] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-3 border-b border-[#3b4754] flex justify-between items-center bg-[#1c2127]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm font-bold">auto_awesome</span>
              <span className="font-bold text-sm">Copilot Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#283039] rounded-full text-[#9dabb9]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-[#9dabb9] text-center text-sm italic">Ask me anything about market trends or client data.</p>
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
        </div>
      )}

      {/* Input Field */}
      <div className="bg-[#1c2127] border border-[#3b4754] rounded-xl shadow-lg p-2 flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 shrink-0">
          <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
        </div>
        <input 
          className="bg-transparent border-none focus:ring-0 text-white text-base flex-1 min-w-0 placeholder-[#9dabb9]" 
          placeholder="Ask Copilot about market trends..." 
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
            onClick={handleSend}
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
  );
};

export default CopilotBar;
