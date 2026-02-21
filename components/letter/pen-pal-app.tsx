"use client"

import { useState } from "react"
import { saveLetter } from "@/lib/letter-store"
import type { SavedLetterState } from "@/lib/letter-store"
import { LetterCanvas } from "./letter-canvas"
import { EnvelopePreview } from "./envelope-preview"
import { SentConfirmation } from "./sent-confirmation"

type AppView = "writing" | "envelope" | "sent"

export function PenPalApp() {
  const [view, setView] = useState<AppView>("writing")
  const [pendingLetter, setPendingLetter] = useState<SavedLetterState | null>(null)
  const [shareableId, setShareableId] = useState<string | null>(null)

  const handleSeal = (state: SavedLetterState) => {
    setPendingLetter(state)
    setView("envelope")
  }

  const handleSend = () => {
    if (pendingLetter) {
      const id = saveLetter(pendingLetter)
      setShareableId(id)
      setView("sent")
    }
  }

  const handleNewLetter = () => {
    setPendingLetter(null)
    setShareableId(null)
    setView("writing")
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{ minHeight: '100vh', backgroundColor: '#faf7f5', color: '#3a3330' }}
    >
      {/* Main Content - header is in layout so it always shows */}
      <main className="pb-12 pt-2">
        {view === "writing" && <LetterCanvas onSeal={handleSeal} />}

        {view === "envelope" && (
          <EnvelopePreview
            onSend={handleSend}
            onBack={() => setView("writing")}
          />
        )}

        {view === "sent" && (
          <SentConfirmation shareableId={shareableId} onNewLetter={handleNewLetter} />
        )}
      </main>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="font-serif text-xs text-muted-foreground/40">
          Some words are best written slowly.
        </p>
      </footer>
    </div>
  )
}
