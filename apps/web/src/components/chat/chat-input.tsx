"use client";

import { useState, useCallback, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (query: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isStreaming, onStop, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="shrink-0 p-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="focus-ring flex items-end gap-3 rounded-2xl p-3 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your documents…"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed focus:outline-none disabled:opacity-40"
          style={{
            color: "#f1f5f9",
            minHeight: "24px",
            maxHeight: "160px",
          }}
        />

        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
              boxShadow: "0 0 12px rgba(244,63,94,0.4)",
              color: "white",
              fontSize: "10px",
            }}
          >
            ■
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={
              canSend
                ? {
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 0 16px rgba(99,102,241,0.45)",
                    color: "white",
                  }
                : {
                    background: "rgba(255,255,255,0.06)",
                    color: "#475569",
                  }
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-xs" style={{ color: "#334155" }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};
