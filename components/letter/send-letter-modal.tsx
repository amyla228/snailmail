"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SendLetterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (recipient: string) => void
}

export function SendLetterModal({
  open,
  onOpenChange,
  onSend,
}: SendLetterModalProps) {
  const [recipient, setRecipient] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = recipient.trim()
    onSend(value || "A friend")
    setRecipient("")
    onOpenChange(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) setRecipient("")
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Send your letter</DialogTitle>
          <DialogDescription className="font-serif text-muted-foreground">
            Who are you sending this to?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="recipient" className="sr-only">
            Recipient email or name
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Email or name (e.g. friend@example.com or Alex)"
            className={cn(
              "w-full rounded-xl border border-border bg-background px-4 py-3 font-serif text-foreground",
              "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            autoFocus
            aria-label="Recipient email or name"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-xl px-4 py-2.5 font-serif text-sm bg-secondary text-secondary-foreground hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "rounded-xl px-6 py-2.5 font-serif text-sm",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "transition-colors"
              )}
            >
              Send
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
