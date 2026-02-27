"use client"

import { useState } from "react"
import type { SavedLetterState } from "@/lib/letter-store"
import { LetterCanvas } from "./letter-canvas"
import { EnvelopePreview } from "./envelope-preview"

type AppView = "writing" | "envelope"

export function PenPalApp() {
  const [view, setView] = useState<AppView>("writing")
  const [pendingLetter, setPendingLetter] = useState<SavedLetterState | null>(null)

  const handleSeal = (state: SavedLetterState) => {
    setPendingLetter(state)
    setView("envelope")
  }

  const handleNewLetter = () => {
    setPendingLetter(null)
    setView("writing")
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{ minHeight: "100vh", backgroundColor: "#faf7f5", color: "#3a3330" }}
    >
      <main className={`pt-2 ${view === "writing" ? "pb-28" : "pb-12"}`}>
        {view === "writing" && <LetterCanvas onSeal={handleSeal} />}

        {view === "envelope" && pendingLetter && (
          <EnvelopePreview
            letter={pendingLetter}
            onNewLetter={handleNewLetter}
          />
        )}
      </main>

      <footer className="pb-6 text-center">
        <p className="font-serif text-xs text-muted-foreground/40">
          Some words are best written slowly.
        </p>
      </footer>
    </div>
  )
}
