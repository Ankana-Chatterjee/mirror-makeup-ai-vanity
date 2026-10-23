import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, RefreshCw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ChatMessage, FaceAnalysisData, LookMoodId } from '../types/glowguide';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  faceAnalysis: FaceAnalysisData | null;
  selectedLook: LookMoodId;
  currentStep: number;
  climate: string;
  preferredBrand: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  faceAnalysis,
  selectedLook,
  currentStep,
  climate,
  preferredBrand,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello beautiful! I am your **Makeup Assistant AI**. I have your look (${selectedLook}) and current step loaded. Ask me about shade matches, creasing fixes, eye techniques, or climate-proofing!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Why is my under-eye concealer creasing?',
    'How do I do batwing liner for hooded eyes?',
    'How do I make my base last in hot humidity?',
    'How do I test shades in natural daylight?',
    'Recommend budget alternative for MAC NC42 / TIRTIR 24N'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content
          })),
          faceContext: faceAnalysis,
          selectedLook,
          currentStep,
          climate,
          preferredBrand
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Could not fetch AI reply');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `I am having trouble connecting right now, but here is a quick rule of thumb: always apply products in sheer, buildable micro-layers and press (don't drag) with a warm fingertip or damp sponge.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-[#fffaf7] border-l border-[#eadde1] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Makeup Assistant AI"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#eadde1] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f8e7ec] flex items-center justify-center text-[#c45b78]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-[#29202a]">Makeup Assistant AI</h3>
              <div className="text-[11px] text-[#766b77] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Beauty Co-pilot</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#766b77] hover:bg-[#f8e7ec] hover:text-[#c45b78] transition"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Banner */}
        <div className="px-4 py-2.5 bg-[#f9f2f4] border-b border-[#eadde1] text-xs text-[#766b77] flex items-center justify-between">
          <div className="truncate">
            <span className="font-bold text-[#c45b78] uppercase text-[10px] tracking-wider">Context:</span>{' '}
            <span className="capitalize">{selectedLook}</span> · Step {currentStep + 1}
            {faceAnalysis?.skinTone ? ` · Monk ${faceAnalysis.skinTone.monkScale} (${faceAnalysis.skinTone.undertone})` : ''}
          </div>
          <span className="text-[10px] bg-white border border-[#eadde1] px-2 py-0.5 rounded-full text-[#766b77] shrink-0">
            {climate}
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#c45b78] text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-[#eadde1] text-[#29202a] rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Formatting markdown basic bold & bullet breaks */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.content.split('\n').map((line, idx) => {
                    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());
                    return (
                      <p key={idx} className={isBullet ? 'pl-2' : ''}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
              <span className="text-[10px] text-[#766b77] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#766b77] bg-white border border-[#eadde1] rounded-2xl px-4 py-2.5 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c45b78]" />
              <span>GlowGuide is thinking…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white/70 border-t border-[#eadde1] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pb-1 w-max">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap bg-[#fffaf7] hover:bg-[#f8e7ec] hover:text-[#c45b78] border border-[#eadde1] text-[#665965] px-2.5 py-1 rounded-full transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#eadde1]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about shade, wings, creasing..."
              className="flex-1 bg-[#fffdfc] border border-[#eadde1] rounded-xl px-3.5 py-2.5 text-xs text-[#29202a] placeholder-[#766b77] outline-none focus:border-[#c45b78] transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-[#c45b78] hover:bg-[#a84664] disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-[#766b77] text-center mt-1.5">
            Always verify skin shades in daylight · Photos not stored
          </div>
        </div>
      </div>
    </div>
  );
};
