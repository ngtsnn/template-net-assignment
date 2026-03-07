import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";

type Message = { role: "user" | "assistant"; content: string };

const mockResponses = [
  "I'd be happy to help you with that! Here's what I can suggest based on your request. Let me know if you'd like me to elaborate on any point.",
  "Great question! Let me break this down for you step by step. First, consider the core requirements, then we can iterate on the details together.",
  "That's an interesting approach. I've analyzed your input and here are my recommendations. Feel free to adjust any parameters as needed.",
  "Here's a creative solution for you! I've considered multiple angles and this approach balances quality with efficiency. What do you think?",
];
export const Route = createFileRoute("/")({ component: App })

function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1500));
    const aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    setIsLoading(false);
  };

  const handleFileUpload = () => {
    toast.info("File upload coming soon!");
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <div className="flex flex-1 flex-col">
        <ChatHeader />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-muted-foreground">Start a conversation below</p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <ChatInput onSend={handleSend} onFileUpload={handleFileUpload} disabled={isLoading} />
      </div>
    </div>
  );
}
