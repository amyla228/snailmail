"use client"

import { cn } from "@/lib/utils"
import type { SavedLetterState } from "@/lib/letter-store"
import { downloadLetterAsHtml } from "@/lib/export-letter-html"

interface EnvelopePreviewProps {
  letter: SavedLetterState
  onDownload: () => void
  onNewLetter: () => void
}

export function EnvelopePreview({ letter, onDownload, onNewLetter }: EnvelopePreviewProps) {
  const handleDownload = () => {
    downloadLetterAsHtml(letter, `letter-${new Date().toISOString().slice(0, 10)}.html`)
    onDownload()
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4 animate-fade-in-up min-h-[60vh] justify-center">
      <div className="relative w-full max-w-md" style={{ perspective: "800px" }}>
        <div
          className="w-full rounded-2xl overflow-hidden relative border border-border"
          style={{
            backgroundColor: "#fef3ed",
            boxShadow: "0 6px 24px rgba(58, 51, 48, 0.08)",
            aspectRatio: "4 / 3",
          }}
        >
          <div className="absolute top-0 left-0 right-0">
            <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none">
              <path d="M0 0 L200 80 L400 0 L400 0 L0 0Z" fill="#f9e8dd" />
              <path d="M0 0 L200 80 L400 0" fill="none" stroke="#e5ddd8" strokeWidth="1" />
            </svg>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
            <p className="text-sm font-serif text-muted-foreground text-center px-4">
              Your letter is sealed. Download it to open and read.
            </p>
          </div>

          <div className="absolute top-5 right-5 w-12 h-14">
            <svg viewBox="0 0 60 72" className="w-full h-full">
              <rect width="60" height="72" rx="2" fill="#fef9f6" stroke="#e5ddd8" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M12 21 C6 15 1 11 1 7 C1 3 4 1 7 1 C9 1 11 3 12 4 C13 3 15 1 17 1 C20 1 23 3 23 7 C23 11 18 15 12 21Z" fill="#e8a0a0" opacity="0.7" />
              <text x="30" y="58" textAnchor="middle" fontSize="6" fill="#8a817c" fontFamily="serif">5c</text>
            </svg>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-sm animate-fade-in-up">
        <button
          type="button"
          onClick={handleDownload}
          className={cn(
            "w-full px-6 py-3 rounded-xl font-serif text-base transition-all border-2",
            "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
          )}
        >
          Download Letter
        </button>
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
