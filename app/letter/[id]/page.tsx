"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { getLetter } from "@/lib/letter-store"
import { LetterView } from "@/components/letter/letter-view"
import { cn } from "@/lib/utils"

export default function LetterPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : ""
  const letter = useMemo(() => (id ? getLetter(id) : undefined), [id])
  const [isOpening, setIsOpening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpening) return
    const t = setTimeout(() => {
      setIsOpen(true)
      setIsOpening(false)
    }, 550)
    return () => clearTimeout(t)
  }, [isOpening])

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#faf7f5", color: "#3a3330" }}>
        <p className="font-serif text-muted-foreground">Invalid link.</p>
      </div>
    )
  }

  if (!letter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: "#faf7f5", color: "#3a3330" }}>
        <p className="font-serif text-lg">Letter not found.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-xl font-serif text-sm bg-primary text-primary-foreground"
        >
          Go home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 pt-6 px-4" style={{ backgroundColor: "#faf7f5", color: "#3a3330" }}>
      {!isOpen ? (
        <>
          <h2 className="font-serif text-2xl text-center mb-2">
            You&apos;ve received a letter
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Click the envelope to open
          </p>
          <button
            type="button"
            onClick={() => setIsOpening(true)}
            disabled={isOpening}
            className={cn(
              "block w-full max-w-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-2xl overflow-hidden transition-transform",
              !isOpening && "hover:scale-[1.02] active:scale-[0.98]"
            )}
            aria-label="Open envelope"
          >
            <div className={cn(isOpening && "animate-envelope-open")}>
              <ClosedEnvelope />
            </div>
          </button>
        </>
      ) : (
        <>
          <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
            <LetterView letter={letter} />
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 px-6 py-2.5 rounded-xl font-serif text-sm bg-secondary text-secondary-foreground hover:bg-border transition-colors"
          >
            Send your own letter
          </button>
        </>
      )}
    </div>
  )
}

function ClosedEnvelope() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-border"
      style={{
        backgroundColor: "#fef3ed",
        boxShadow: "0 6px 24px rgba(58, 51, 48, 0.08)",
        aspectRatio: "4 / 3",
      }}
    >
      <div className="absolute top-0 left-0 right-0 w-full">
        <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none">
          <path d="M0 0 L200 80 L400 0 L400 0 L0 0Z" fill="#f9e8dd" />
          <path d="M0 0 L200 80 L400 0" fill="none" stroke="#e5ddd8" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
          <span className="text-2xl">💌</span>
        </div>
      </div>
      <div className="absolute top-5 right-5 w-12 h-14">
        <svg viewBox="0 0 60 72" className="w-full h-full">
          <rect width="60" height="72" rx="2" fill="#fef9f6" stroke="#e5ddd8" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M12 21 C6 15 1 11 1 7 C1 3 4 1 7 1 C9 1 11 3 12 4 C13 3 15 1 17 1 C20 1 23 3 23 7 C23 11 18 15 12 21Z" fill="#e8a0a0" opacity="0.7" />
          <text x="30" y="58" textAnchor="middle" fontSize="6" fill="#8a817c" fontFamily="serif">5c</text>
        </svg>
      </div>
    </div>
  )
}
