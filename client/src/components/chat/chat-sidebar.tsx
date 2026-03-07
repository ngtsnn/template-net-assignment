import {
  Crown,
  FileText,
  FolderOpen,
  Globe,
  Home,
  Image,
  LayoutTemplate,
  LogIn,
  Monitor,
  MoreHorizontal,
  Palette,
  Video,
} from "lucide-react"

const navItems = [
  { icon: Home, label: "Home" },
  { icon: FileText, label: "Document" },
  { icon: Palette, label: "Design" },
  { icon: Monitor, label: "Presentation" },
  { icon: Image, label: "Image" },
  { icon: Video, label: "Video" },
  { icon: MoreHorizontal, label: "More" },
]

const bottomNavItems = [
  { icon: LayoutTemplate, label: "Templates" },
  { icon: Globe, label: "Brand" },
  { icon: FolderOpen, label: "Projects" },
]

export function ChatSidebar() {
  return (
    <aside className="flex h-screen w-16 flex-col items-center border-r border-sidebar-border bg-sidebar py-4">
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex w-12 flex-col items-center gap-0.5 rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] leading-tight">{item.label}</span>
          </button>
        ))}
        <div className="my-2 h-px w-8 bg-sidebar-border" />
        {bottomNavItems.map((item) => (
          <button
            key={item.label}
            className="flex w-12 flex-col items-center gap-0.5 rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1">
        <button className="text-sidebar-muted flex w-12 flex-col items-center gap-0.5 rounded-lg p-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogIn className="h-5 w-5" />
          <span className="text-[10px] leading-tight">Sign in</span>
        </button>
        <button className="flex w-12 flex-col items-center gap-0.5 rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:opacity-90">
          <Crown className="h-5 w-5" />
          <span className="text-[10px] leading-tight">Upgrade</span>
        </button>
      </div>
    </aside>
  )
}
