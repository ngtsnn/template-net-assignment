import clsx from "clsx"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessageProps {
  role: "user" | "assistant" | "system"
  content: string
  attachments?: Array<{ type: string; url: string }>
}

export function ChatMessage({ role, content, attachments }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-chat-ai text-chat-ai-foreground"
        }`}
      >
        <div
          className={clsx(
            "prose prose-sm max-w-none wrap-break-word",
            isUser ? "prose-p:text-chat-user-foreground" : "dark:prose-invert"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {attachments && attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {attachments.map((file, i) => {
              if (file.type.includes("image")) {
                return (
                  <img
                    key={i}
                    src={file.url}
                    alt="attachment"
                    className="max-h-48 max-w-full rounded-md object-cover"
                  />
                )
              }
              // placeholder for non-image types
              return (
                <div
                  key={i}
                  className="flex h-16 w-16 items-center justify-center rounded-md bg-muted/50 p-2 text-xs text-muted-foreground"
                >
                  File
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
