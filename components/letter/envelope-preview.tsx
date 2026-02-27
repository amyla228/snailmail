"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { SavedLetterState } from "@/lib/letter-store"
import { supabase } from "@/lib/supabase"

interface EnvelopePreviewProps {
  /** Letter state; if no id, we save to Supabase on Send Letter then open Gmail */
  letter: SavedLetterState & { id?: string }
  onNewLetter: () => void
}

export function EnvelopePreview({ letter, onNewLetter }: EnvelopePreviewProps) {
  const [sending, setSending] = useState(false)

  const handleSendLetter = async () => {
    let id = letter.id
    if (!id) {
      setSending(true)
      try {
        const payload = {
          to_name: letter.recipientName?.trim() || "A friend",
          from_name: letter.signature?.trim() || "",
          content: JSON.stringify(letter),
        }
        const { data, error } = await supabase
          .from("letters")
          .insert(payload)
          .select("id")
          .single()
        if (error) {
          console.error("Error saving letter:", error)
          setSending(false)
          return
        }
        id = data?.id as string | undefined
        if (!id) {
          console.error("No id returned from save")
          setSending(false)
          return
        }
      } finally {
        setSending(false)
      }
    }
    if (!id) return
    const shareUrl = `${window.location.origin}/letter/${id}`
    const subject = "New Letter from your Pen Pal 💌"
    const body = `Copy and paste this link into your browser to read my letter:\n${shareUrl}`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, "_blank", "noopener,noreferrer")
  }

  const toName = letter.recipientName?.trim() || "—"
  const fromName = letter.signature?.trim() || "—"

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4 animate-fade-in-up min-h-[60vh] justify-center">
      {/* Back of envelope: flat rectangle, no front flap; To/From text; stamps on back */}
      <div className="relative w-full max-w-md" style={{ perspective: "800px" }}>
        <div
          className="w-full rounded-2xl overflow-hidden relative border border-border flex flex-col items-center justify-center py-10 px-8"
          style={{
            backgroundColor: "#fef3ed",
            boxShadow: "0 6px 24px rgba(58, 51, 48, 0.08)",
            aspectRatio: "4 / 3",
          }}
        >
          {/* Stamps on back of envelope (top right) */}
          <div className="absolute top-4 right-4 flex gap-1">
            <svg viewBox="0 0 60 72" className="w-10 h-12">
              <rect width="60" height="72" rx="2" fill="#fef9f6" stroke="#e5ddd8" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M12 21 C6 15 1 11 1 7 C1 3 4 1 7 1 C9 1 11 3 12 4 C13 3 15 1 17 1 C20 1 23 3 23 7 C23 11 18 15 12 21Z" fill="#e8a0a0" opacity="0.7" />
              <text x="30" y="58" textAnchor="middle" fontSize="5" fill="#8a817c" fontFamily="serif">5c</text>
            </svg>
          </div>

          {/* To: and From: on back — centered, larger font */}
          <div className="flex flex-col gap-5 text-center font-serif text-lg text-foreground">
            <div>
              <span className="text-muted-foreground mr-2">To:</span>
              <span>{toName}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">From:</span>
              <span>{fromName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-sm animate-fade-in-up">
        <button
          type="button"
          onClick={handleSendLetter}
          disabled={sending}
          className={cn(
            "w-full px-6 py-3 rounded-xl font-serif text-base transition-all border-2",
            "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-md hover:shadow-lg",
            "disabled:opacity-60 disabled:cursor-wait"
          )}
        >
          {sending ? "Saving…" : "Send Letter"}
        </button>
        <p className="text-xs text-muted-foreground text-center font-serif">
          This will open your email with the letter link included.
        </p>
        <button
          type="button"
          onClick={onNewLetter}
          className="w-full px-6 py-2.5 rounded-xl font-serif text-sm transition-all bg-secondary text-secondary-foreground hover:bg-border"
        >
          Write Another Letter
        </button>
      </div>
    </div>
  )
}
