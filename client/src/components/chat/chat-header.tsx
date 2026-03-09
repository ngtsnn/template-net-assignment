import { Search } from "lucide-react"
import { useState } from "react"
import SignUpModal from "../auth/sign-up-modal"
import { Button } from "../ui/button"
import SignInModal from "../auth/sign-in-modal"
import { useGetMe } from "@/store/api/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function UserPanel() {
  const { data: user } = useGetMe()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
              alt={user?.name}
            />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => {
            localStorage.removeItem("accessToken")
            window.location.href = "/"
          }}>
            Logout
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ChatHeader() {
  const { data: user, isLoading: meLoading } = useGetMe()
  const [openSignUp, setOpenSignUp] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)

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
        {meLoading ? null : user ? (
          <UserPanel />
        ) : (
          <span className="flex items-center gap-2">
            <span className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </span>
            <Button
              variant="link"
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpenSignIn(true)}
            >
              Sign in
            </Button>
          </span>
        )}
      </div>
      {openSignUp && (
        <SignUpModal
          open={openSignUp}
          onOpenChange={setOpenSignUp}
          onSignInClick={() => {
            setOpenSignUp(false)
            setOpenSignIn(true)
          }}
        />
      )}
      {openSignIn && (
        <SignInModal
          open={openSignIn}
          onOpenChange={setOpenSignIn}
          onSignUpClick={() => {
            setOpenSignIn(false)
            setOpenSignUp(true)
          }}
        />
      )}
    </header>
  )
}
