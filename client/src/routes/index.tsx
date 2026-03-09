import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import type { Message } from "@/types/chat"

import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import Layout from "@/layouts/layout"
import { useChat, useNewMessage } from "@/store/api/chat"
import { useNewThread } from "@/store/api/thread"

type SearchParams = {
  threadId?: string
}

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      threadId: search.threadId as string | undefined,
    }
  },
})

function App() {
  const { threadId } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()

  const [optimisticMessages, setOptimisticMessages] = useState<Array<Message>>([])
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // Remote Queries
  const { data: remoteMessages = [], isLoading: isFetchingChat } = useChat(threadId || "")
  const { mutateAsync: mutateNewThread, isPending: isCreatingThread } = useNewThread()
  const { mutateAsync: mutateNewMessage, isPending: isSendingMessage } = useNewMessage(threadId || "")

  const isLoading = isCreatingThread || isSendingMessage || isFetchingChat

  const allMessages = optimisticMessages.length > 0 ? optimisticMessages : remoteMessages

  // Reset optimistic state when remote messages sync
  useEffect(() => {
    if (remoteMessages.length > 0) {
      setOptimisticMessages([])
    }
  }, [remoteMessages])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [allMessages, isLoading])

  const handleSend = async (content: string, attachments: Array<{ url: string; type: string }>) => {
    // Generate optimistic user message
    const tempId = window.crypto.randomUUID()
    const userMsg: Message = { _id: tempId, role: "user", content, attachments, threadId: threadId || "" }
    
    // Copy whatever current messages exist to append optimistic updates to them
    setOptimisticMessages([...allMessages, userMsg])

    try {
      if (!threadId) {
        // Create new thread
        const response: any = await mutateNewThread({ content, attachments })
        
        // Response format is { thread, message }. E.g response.thread._id
        const newThreadId = response.thread._id
        
        // Invalidate threads query so the sidebar automatically refreshes
        queryClient.invalidateQueries({ queryKey: ['threads'] })
        
        // Navigate via router. The navigation changes the 'threadId' meaning useChat begins fetching automatically for this new thread!
        navigate({ search: { threadId: newThreadId } })
      } else {
        // Add to existing thread
        await mutateNewMessage({ content, attachments })
        
        // Refetch chat to get the newly appended ai message globally
        queryClient.invalidateQueries({ queryKey: ['threads', threadId] })
      }
    } catch (err) {
      toast.error("Failed to send message.")
      // Revert optimistic insert on error
      setOptimisticMessages([])
    }
  }

  return (
    <Layout>
      <>
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {(!threadId && allMessages.length === 0) ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-muted-foreground">
                Start a conversation below
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {allMessages.map((msg, i) => (
                <ChatMessage key={msg._id || i} role={msg.role} content={msg.content} attachments={msg.attachments} />
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
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </>
    </Layout>
  )
}

