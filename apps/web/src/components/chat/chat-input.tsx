"use client";

import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="border-t border-navy-100 bg-white p-4">
      <div className="flex items-end gap-3 rounded-xl border border-navy-200 bg-alice-blue p-3 focus-within:border-navy-400 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your documents…"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-sm text-navy-800 placeholder:text-navy-400 focus:outline-none disabled:opacity-50"
          style={{ minHeight: "24px", maxHeight: "160px" }}
        />
        {isStreaming ? (
          <Button variant="danger" size="icon" onClick={onStop} className="shrink-0">
            ■
          </Button>
        ) : (
          <Button
            variant="primary"
            size="icon"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="shrink-0"
          >
            ↑
          </Button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-navy-400">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};
