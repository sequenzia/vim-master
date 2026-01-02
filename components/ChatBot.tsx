import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createWizardChat } from '../services/geminiService';

const ANTHONY_AVATAR_SM = 'https://storage.googleapis.com/sequenzia-public/assets/images/vim/wizard_anthony_sm.jpeg';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    <aside className="bg-gray-900/95 border-l border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="bg-purple-900/80 px-4 py-3 border-b border-purple-800/50">
        <h3 className="text-purple-200 font-bold flex items-center gap-2 font-fantasy">
          <img src={ANTHONY_AVATAR_SM} alt="Anthony" className="w-6 h-6 rounded-full border border-purple-400" />
          Ask Anthony
        </h3>
        <p className="text-xs text-purple-400 mt-0.5">Get help with Vim commands</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
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
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-gray-800/80 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about :q!"
            className="flex-1 bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ChatBot;
