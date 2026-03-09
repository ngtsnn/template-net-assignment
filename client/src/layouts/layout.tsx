import type { ReactNode } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatThreads } from "@/components/chat/chat-threads";

export default function Layout({children}: {children: ReactNode}) {

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <ChatThreads />
      <div className="flex flex-1 flex-col">
        <ChatHeader />
        {children}
      </div>
    </div>
  );
}
