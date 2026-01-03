"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const ANTHONY_AVATAR_SM =
  "https://storage.googleapis.com/sequenzia-public/assets/images/vim/wizard_anthony_sm.jpeg";

const ChatBot: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Speak, apprentice. What forbidden knowledge do you seek?",
          },
        ],
      },
    ],
    onError: (err) => console.error("Chat error:", err),
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <aside className="bg-gray-900/95 border-l border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="bg-purple-900/80 px-4 py-3 border-b border-purple-800/50 flex items-center gap-3">
        <img
          src={ANTHONY_AVATAR_SM}
          alt="Anthony"
          className="w-10 h-10 rounded-full border-2 border-purple-400"
        />
        <div>
          <h3 className="text-purple-100 font-bold font-fantasy">
            Ask Anthony
          </h3>
          <p className="text-xs text-purple-300">Arcane Vim Wisdom</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          // Extract text from parts array (v5+ API) or fall back to content (v4)
          const text =
            msg.parts
              ?.filter(
                (p): p is { type: "text"; text: string } => p.type === "text"
              )
              .map((p) => p.text)
              .join("") ||
            (msg as { content?: string }).content ||
            "";

          return (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-purple-700 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-300 border border-gray-700 rounded-bl-none"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        className="p-3 bg-gray-800/80 border-t border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat about Vim"
            disabled={isLoading}
            className="flex-1 bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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
