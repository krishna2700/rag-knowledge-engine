"use client";

import { useEffect, useRef, useCallback } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/features/chat/use-chat";

const SUGGESTIONS = [
  "Summarize the key findings",
  "What are the main topics covered?",
  "Explain the methodology used",
];

const EmptyState = ({ onSuggest }: { onSuggest: (s: string) => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center animate-fade-up">
    <div className="relative">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-3xl"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)",
          border: "1px solid rgba(99,102,241,0.3)",
          boxShadow: "0 0 40px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </div>
      <div
        className="absolute -inset-3 rounded-full opacity-20 animate-glow-pulse"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)" }}
      />
    </div>

    <div className="space-y-2">
      <h2 className="text-xl font-semibold gradient-text">Ask your knowledge base</h2>
      <p className="text-sm max-w-sm leading-relaxed" style={{ color: "#475569" }}>
        Upload documents and ask questions. Powered by hybrid BM25 + vector search with GPT-4o.
      </p>
    </div>

    <div className="flex flex-col gap-2 w-full max-w-sm">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSuggest(s)}
          className="rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.3)";
            (e.currentTarget as HTMLButtonElement).style.color = "#c7d2fe";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
        >
          <span style={{ color: "#6366f1", marginRight: "8px" }}>→</span>
          {s}
        </button>
      ))}
    </div>
  </div>
);

export const ChatWindow = () => {
  const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggest = useCallback((s: string) => {
    sendMessage(s);
  }, [sendMessage]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onSuggest={handleSuggest} />
        ) : (
          <div className="space-y-6 p-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm animate-fade-in"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#fda4af",
                }}
              >
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="flex justify-center pb-1">
          <button
            onClick={clearMessages}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{ color: "#334155" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#334155"; }}
          >
            Clear conversation
          </button>
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        isStreaming={isStreaming}
        onStop={stopStreaming}
      />
    </div>
  );
};
