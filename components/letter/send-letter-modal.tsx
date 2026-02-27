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
import type { SavedLetterState } from "@/lib/letter-store"
import { supabase } from "@/lib/supabase"

interface SendLetterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Optional: still called after a successful send, for caller bookkeeping.
   */
  onSend?: (toName: string) => void
  /**
   * The full current letter state to persist to Supabase.
   */
  letter: SavedLetterState
}

export function SendLetterModal({
  open,
  onOpenChange,
  onSend,
  letter,
}: SendLetterModalProps) {
  const [toNameInput, setToNameInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const toName = toNameInput.trim() || "A friend"

    try {
      setIsSubmitting(true)

      const payload = {
        to_name: toName,
        from_name: letter.signature?.trim() || "",
        content: JSON.stringify(letter),
      }

      const { data, error } = await supabase
        .from("letters")
        .insert(payload)
        .select("id")
        .single()

      if (error) {
        // Log and bail; keep the modal open so the user can retry.
        console.error("Error inserting letter into Supabase:", error)
        return
      }

      const id = data?.id as string | undefined
      if (!id) {
        console.error("Supabase insert succeeded but no id was returned.")
        return
      }

      if (onSend) {
        onSend(toName)
      }

      setToNameInput("")
      onOpenChange(false)

      // Redirect to the public letter route.
      if (typeof window !== "undefined") {
        window.location.href = `/l/${id}`
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) setToNameInput("")
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
          <label htmlFor="to-name" className="sr-only">
            To (name)
          </label>
          <input
            id="to-name"
            type="text"
            value={toNameInput}
            onChange={(e) => setToNameInput(e.target.value)}
            placeholder="Name (e.g. Alex)"
            className={cn(
              "w-full rounded-xl border border-border bg-background px-4 py-3 font-serif text-foreground",
              "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            autoFocus
            aria-label="To (name)"
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
              disabled={isSubmitting}
              className={cn(
                "rounded-xl px-6 py-2.5 font-serif text-sm",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "transition-colors",
                isSubmitting && "opacity-60 cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
