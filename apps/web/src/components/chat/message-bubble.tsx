"use client";

import { memo, useState } from "react";
import { cn, formatDate } from "@/lib/utils";
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
        className="text-xs font-medium text-navy-500 hover:text-navy-700 transition-colors"
      >
        {open ? "▾" : "▸"} {sources.length} source{sources.length !== 1 ? "s" : ""}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {sources.map((s, i) => (
            <div key={i} className="rounded-lg border border-navy-100 bg-alice-blue p-3">
              <p className="text-xs font-semibold text-navy-700">{s.document_title}</p>
              <p className="mt-1 text-xs text-navy-500 line-clamp-3">{s.content}</p>
              <p className="mt-1 text-xs text-navy-400">
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
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isUser ? "bg-navy-700 text-white" : "bg-alice-blue border border-navy-200 text-navy-700"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div className={cn("max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-navy-700 text-white rounded-tr-sm"
              : "bg-white border border-navy-100 text-navy-800 rounded-tl-sm shadow-sm"
          )}
        >
          {message.content || (
            <span className="inline-flex gap-1">
              <span className="animate-bounce">·</span>
              <span className="animate-bounce [animation-delay:0.15s]">·</span>
              <span className="animate-bounce [animation-delay:0.3s]">·</span>
            </span>
          )}
          {message.isStreaming && message.content && (
            <span className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-navy-400" />
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesPanel sources={message.sources} />
        )}

        <p className={cn("mt-1 text-xs text-navy-400", isUser && "text-right")}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
