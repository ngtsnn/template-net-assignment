import { Search } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        <span className="text-primary">TEMPLATE</span>
        <span className="font-normal">.NET</span>
      </h1>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground transition-colors hover:text-foreground">
          <Search className="h-5 w-5" />
        </button>
        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Pricing</span>
        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Sign up</span>
      </div>
    </header>
  );
}
