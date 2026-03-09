import { Mic, Paperclip, Plus, Send, XCircle } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import type { ChangeEvent, KeyboardEvent } from "react"
import http from "@/config/http"

interface ChatInputProps {
  onSend: (message: string, attachments: Array<{ url: string; type: string }>) => void
  disabled?: boolean
}

type UploadedFile = {
  tempId: string
  url: string
  type: string
  isUploading: boolean
  file: File
}

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  // "video/mp4",
  // "video/mpeg",
  // "video/quicktime",
  "application/pdf",
]

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

type Asset = {
  fileName: string
  url: string
  fileType: string
  fileSize: number
}

const acceptTypes = ALLOWED_FILE_TYPES.join(",")

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [uploadFiles, setUploadFiles] = useState<Array<UploadedFile>>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // const { mutate } = useMutation({
  //   mutationKey: ["new-message"],
  //   mutationFn: () => {},
  // })

  const handleSend = () => {
    if (!value.trim() || disabled) return
    const formattedAttachments = uploadFiles.map(file => ({ url: file.url, type: file.type }))
    onSend(value.trim(), formattedAttachments)
    setValue("")
    setUploadFiles([])
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 160) + "px"
    }
  }

  const uploadFile = async (file: UploadedFile) => {
    console.log(
      "🔍 ~ ChatInput ~ client/src/components/chat/chat-input.tsx:83 ~ file:",
      file
    )
    setUploadFiles((old) => {
      return [...old, file]
    })
    const formData = new FormData()
    formData.append("file", file.file)
    try {
      const data = (await http.post("/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })) as any as Asset
      if (file.url) {
        URL.revokeObjectURL(file.url)
      }
      file.url = data.url
      file.type = data.fileType
      setUploadFiles((old) => {
        return old.map((f) => (f.tempId === file.tempId ? { ...file } : f))
      })
    } catch (error) {
      toast.error(`Failed to upload file ${file.file.name}`)
      setUploadFiles((old) => {
        return old.filter((f) => f.tempId != file.tempId)
      })
    }
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files // A FileList object
    if (!files) {
      return
    }

    const file = files[0]
    if (file.size > MAX_FILE_SIZE) {
      toast.error("file exceeds 5MB")
    }

    const tempId = window.crypto.randomUUID()
    const uploadedFile: UploadedFile = {
      tempId,
      url: URL.createObjectURL(file),
      type: file.type,
      isUploading: true,
      file,
    }

    uploadFile(uploadedFile)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus className="h-4 w-4 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <label
                      className="flex flex-1 items-center justify-between"
                      htmlFor="uploader"
                    >
                      Upload
                      <Paperclip />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type="file"
              id="uploader"
              hidden
              onChange={onFileChange}
              size={MAX_FILE_SIZE}
              accept={acceptTypes}
            />
            {uploadFiles.map((f) => {
              let previewImg = ""
              if (f.file.type.includes("image")) {
                previewImg = f.url
              } else {
                previewImg = "/pdf-placeholder.jpg"
              }
              return (
                <div className="relative h-10 w-10 rounded-md">
                  <XCircle
                    onClick={() =>
                      setUploadFiles((old) => {
                        return old.filter((file) => file.tempId === f.tempId)
                      })
                    }
                    size={12}
                    className="absolute -top-1.5 -right-1.5"
                  />
                  <img src={previewImg} alt="" />
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Generate Free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
