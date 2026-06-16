import { Header } from "@/components/layout/header";
import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Chat"
        subtitle="Ask questions across your knowledge base"
      />
      <ChatWindow />
    </div>
  );
}
