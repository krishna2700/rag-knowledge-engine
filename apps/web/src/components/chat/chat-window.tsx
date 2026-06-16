"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/features/chat/use-chat";

const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-alice-blue border border-navy-100 text-3xl">
      🔍
    </div>
    <div>
      <h2 className="text-base font-semibold text-navy-800">Ask your knowledge base</h2>
      <p className="mt-1 text-sm text-navy-400 max-w-sm">
        Upload documents and ask questions. The engine uses hybrid BM25 + vector search to find the most relevant context.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
      {[
        "Summarize the key findings",
        "What are the main topics covered?",
        "Explain the methodology used",
      ].map((suggestion) => (
        <button
          key={suggestion}
          className="rounded-lg border border-navy-100 bg-white px-4 py-2.5 text-left text-sm text-navy-600 hover:bg-alice-blue hover:border-navy-200 transition-colors"
        >
          {suggestion}
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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6 p-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="flex justify-center pb-2">
          <Button variant="ghost" size="sm" onClick={clearMessages} className="text-xs">
            Clear conversation
          </Button>
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
