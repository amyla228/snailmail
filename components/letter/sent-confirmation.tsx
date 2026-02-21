"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SentConfirmationProps {
  shareableId: string | null
  onNewLetter: () => void
}

export function SentConfirmation({ shareableId, onNewLetter }: SentConfirmationProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const msgTimer = setTimeout(() => setShowMessage(true), 400)
    const actionsTimer = setTimeout(() => setShowActions(true), 1000)
    return () => {
      clearTimeout(msgTimer)
      clearTimeout(actionsTimer)
    }
  }, [])

  const shareUrl = typeof window !== "undefined" && shareableId
    ? `${window.location.origin}/letter/${shareableId}`
    : ""

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select and copy
      const input = document.createElement("input")
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-[60vh] px-4">
      {/* Optional envelope sealing animation */}
      <div className="animate-gentle-bounce">
        <svg
          viewBox="0 0 120 100"
          className="w-32 h-28"
          style={{ animationDuration: "4s", animationIterationCount: "infinite", animationDirection: "alternate" }}
        >
          <rect x="10" y="30" width="100" height="55" rx="8" fill="#fef3ed" stroke="#e5ddd8" strokeWidth="1.5" />
          <path d="M10 30 L60 62 L110 30" fill="#f9e8dd" stroke="#e5ddd8" strokeWidth="1.5" />
          <path d="M60 44 C57 40 52 40 52 44 C52 48 60 52 60 52 C60 52 68 48 68 44 C68 40 63 40 60 44Z" fill="#d4856a" opacity="0.6" />
        </svg>
      </div>

      {showMessage && (
        <div className="text-center flex flex-col gap-4 animate-fade-in-up">
          <h2 className="font-serif text-2xl text-foreground text-balance">
            Your letter has been sent 💌
          </h2>
          <p className="font-serif text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Share the link below so someone can open your snail mail.
          </p>
        </div>
      )}

      {showActions && shareableId && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm animate-fade-in-up">
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "w-full px-6 py-3 rounded-xl font-serif text-sm transition-all border-2",
              copied
                ? "bg-primary/20 border-primary text-primary"
                : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            )}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={onNewLetter}
            className="px-6 py-2.5 rounded-xl font-serif text-sm transition-all bg-secondary text-secondary-foreground hover:bg-border"
          >
            Write Another Letter
          </button>
        </div>
      )}
    </div>
  )
}
