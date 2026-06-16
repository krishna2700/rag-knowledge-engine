"use client";

import { memo, useState } from "react";
import { formatDate } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

const SourcesPanel = ({ sources }: { sources: NonNullable<ChatMessage["sources"]> }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
        style={{ color: open ? "#818cf8" : "#475569" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#818cf8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = open ? "#818cf8" : "#475569"; }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </button>

      {open && (
        <div className="mt-2 space-y-2 animate-fade-in">
          {sources.map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3"
              style={{
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "#818cf8" }}>
                {s.document_title}
              </p>
              <p className="mt-1 text-xs leading-relaxed line-clamp-3" style={{ color: "#64748b" }}>
                {s.content}
              </p>
              <p className="mt-1.5 text-xs" style={{ color: "#334155" }}>
                Score: {s.score.toFixed(3)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                color: "white",
              }
            : {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#818cf8",
              }
        }
      >
        {isUser ? "U" : "AI"}
      </div>

      <div className={`max-w-[75%] ${isUser ? "items-end" : ""}`}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                  color: "white",
                  borderBottomRightRadius: "6px",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  color: "#e2e8f0",
                  borderTopLeftRadius: "6px",
                }
          }
        >
          {message.content || (
            <span className="inline-flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </span>
          )}
          {message.isStreaming && message.content && (
            <span
              className="ml-0.5 inline-block h-4 w-0.5 animate-blink rounded-full"
              style={{ background: "#818cf8", verticalAlign: "text-bottom" }}
            />
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesPanel sources={message.sources} />
        )}

        <p
          className={`mt-1 text-xs ${isUser ? "text-right" : ""}`}
          style={{ color: "#334155" }}
        >
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
