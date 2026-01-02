import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createWizardChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Speak, apprentice. What forbidden knowledge do you seek?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createWizardChat();
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      const responseText = result.text;
      setMessages(prev => [...prev, { role: 'model', text: responseText || "..." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The void interrupts our connection. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-gray-900 border-2 border-purple-600 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-fade-in-up" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-purple-900 p-3 flex justify-between items-center border-b border-purple-700">
            <h3 className="text-purple-200 font-bold flex items-center gap-2">
              <span className="text-xl">🧙‍♂️</span> Ask Anthony
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-purple-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-700 text-white rounded-br-none' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-gray-800 border-t border-purple-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about :q!"
                className="flex-1 bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded transition-colors disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-purple-900 hover:bg-purple-800 text-white pl-4 pr-6 py-3 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] border-2 border-purple-500 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]"
          aria-label="Chat with Anthony, The Vim Master"
        >
          <div className="relative">
            <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform block">🧙‍♂️</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-fantasy font-bold text-purple-200 leading-tight">Ask Anthony</span>
            <span className="text-xs text-purple-400 font-mono">The Vim Master</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;