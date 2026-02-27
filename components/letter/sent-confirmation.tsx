"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { getLetter } from "@/lib/letter-store"
import type { SavedLetterState } from "@/lib/letter-store"
import { LetterView } from "./letter-view"
import html2canvas from "html2canvas"

interface SentConfirmationProps {
  shareableId: string | null
  recipient?: string | null
  onNewLetter: () => void
}

export function SentConfirmation({ shareableId, recipient, onNewLetter }: SentConfirmationProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [letter, setLetter] = useState<SavedLetterState | null>(null)
  const [downloading, setDownloading] = useState(false)
  const letterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const msgTimer = setTimeout(() => setShowMessage(true), 400)
    const actionsTimer = setTimeout(() => setShowActions(true), 800)
    return () => {
      clearTimeout(msgTimer)
      clearTimeout(actionsTimer)
    }
  }, [])

  useEffect(() => {
    if (shareableId) {
      const data = getLetter(shareableId)
      setLetter(data ?? null)
    } else {
      setLetter(null)
    }
  }, [shareableId])

  const handleDownload = async () => {
    if (!letterRef.current || !letter) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(letterRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement("a")
      link.download = `letter-${shareableId ?? "download"}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-[60vh] px-4">
      {/* Off-screen letter for export (must be in DOM for html2canvas) */}
      {letter && (
        <div
          ref={letterRef}
          className="absolute top-0 w-[512px]"
          style={{ left: "-9999px" }}
          aria-hidden
        >
          <LetterView letter={letter} />
        </div>
      )}

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
            Download your letter or write another.
          </p>
        </div>
      )}

      {showActions && shareableId && (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm animate-fade-in-up">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!letter || downloading}
            className={cn(
              "w-full px-6 py-3 rounded-xl font-serif text-sm transition-all border-2",
              "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {downloading ? "Preparing…" : "Download Letter"}
          </button>
          <button
            type="button"
            onClick={onNewLetter}
            className="mt-2 px-6 py-2.5 rounded-xl font-serif text-sm transition-all bg-secondary text-secondary-foreground hover:bg-border"
          >
            Write Another Letter
          </button>
        </div>
      )}
    </div>
  )
}
