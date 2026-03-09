import { Link, useRouter, useSearch } from "@tanstack/react-router"
import { useThreads } from "@/store/api/thread"
import { Route } from "@/routes"

const empty: Array<any> = []
export function ChatThreads() {
  // Access all search params for the current route
  const { threadId } = Route.useSearch()
  console.log("🔍 ~ ChatThreads ~ client/src/components/chat/chat-threads.tsx:8 ~ threadId:", threadId, !threadId);
  const { data: threads = empty } = useThreads()
  if (threads.length === 0) {
    return null
  }

  return (
    <aside className="flex h-screen w-64 flex-col items-center border-r border-sidebar-border bg-sidebar p-4">
      <nav className="flex w-full flex-1 flex-col items-center gap-1">
        <Link
          to="/"
          className="flex w-full flex-col items-center gap-0.5 rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
          // activeProps={{ "data-status": threadId ? "false" : "active" }}
        >
          <span className="w-full truncate text-xs font-medium">New Chat</span>
        </Link>
        {threads.map((item) => (
          <Link
            key={item._id}
            to="/"
            search={{ threadId: item._id }}
            className="flex w-full flex-col items-center gap-0.5 rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
            activeProps={{
              "data-status": threadId === item._id ? "active" : "",
            }}
          >
            <span className="w-full truncate text-xs font-medium">
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
