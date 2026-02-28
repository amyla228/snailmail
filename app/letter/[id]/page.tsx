"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { SavedLetterState } from "@/lib/letter-store"
import { LetterView } from "@/components/letter/letter-view"
import { WashiTape } from "@/components/letter/washi-tape"
import { Sticker } from "@/components/letter/sticker"
import { WaxSeal } from "@/components/letter/wax-seal"
import { cn } from "@/lib/utils"

export default function LetterPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : ""
  const [letter, setLetter] = useState<SavedLetterState | null | undefined>(undefined)
  const [isOpening, setIsOpening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!id) {
      setLetter(undefined)
      return
    }
    let cancelled = false
    async function fetchLetter() {
      const { data, error } = await supabase
        .from("letters")
        .select("content")
        .eq("id", id)
        .single()
      if (cancelled) return
      if (error || !data?.content) {
        setLetter(null)
        return
      }
      try {
        const parsed = JSON.parse(data.content) as SavedLetterState
        setLetter(parsed)
      } catch {
        setLetter(null)
      }
    }
    fetchLetter()
    return () => {
      cancelled = true
    }
  }, [id])

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

  if (letter === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#faf7f5", color: "#3a3330" }}>
        <p className="font-serif text-muted-foreground">Loading letter…</p>
      </div>
    )
  }

  if (letter === null) {
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
              <ClosedEnvelope letter={letter} />
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

function ClosedEnvelope({ letter }: { letter: SavedLetterState }) {
  const envelopeBg = letter.envelopeColor ?? "#fef3ed"
  const borderColor = "#e5ddd8"
  const decorations = letter.envelopeDecorations ?? []
  const doodles = letter.envelopeDoodles ?? []
  const toName = letter.recipientName?.trim() || "—"
  const fromName = letter.signature?.trim() || "—"
  type StickerType = "heart" | "star" | "flower" | "butterfly" | "sun"
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: envelopeBg,
        borderColor,
        boxShadow: "0 6px 24px rgba(58, 51, 48, 0.08)",
        aspectRatio: "4 / 3",
      }}
    >
      {/* Flap — same color as body, outline only (no horizontal divider) */}
      <div className="absolute top-0 left-0 right-0 w-full z-10" style={{ height: "48%" }}>
        <svg viewBox="0 0 400 192" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 0 L200 160 L400 0 Z" fill={envelopeBg} stroke="none" />
          <path d="M0 0 L200 160 L400 0" fill="none" stroke={borderColor} strokeWidth="1" />
        </svg>
      </div>
      {/* To / From on envelope front (body), from letter data */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center font-serif text-foreground pt-24">
        <p className="text-base sm:text-lg text-center">
          <span className="text-muted-foreground font-medium">To:</span>{" "}
          <span className={cn(!toName || toName === "—" ? "opacity-70" : "")}>{toName}</span>
        </p>
        <p className="text-base sm:text-lg text-center mt-2">
          <span className="text-muted-foreground font-medium">From:</span>{" "}
          <span className={cn(!fromName || fromName === "—" ? "opacity-70" : "")}>{fromName}</span>
        </p>
      </div>
      {/* Envelope doodles (read-only) */}
      {doodles.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" preserveAspectRatio="none">
          {doodles.map((stroke, i) =>
            stroke.points.length > 1 ? (
              <polyline
                key={i}
                points={stroke.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={stroke.color ?? "#4a3728"}
                strokeWidth={stroke.width ?? 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
          )}
        </svg>
      )}
      {/* Envelope decorations (read-only) */}
      {decorations.map((deco) => (
        <div
          key={deco.id}
          className="absolute z-[6] drop-shadow-sm pointer-events-none"
          style={{ left: deco.x, top: deco.y, transform: "translate(-50%, -50%)" }}
        >
          {deco.type === "washi" && <WashiTape color={deco.data.color as "pink" | "green" | "yellow" | "blue"} rotation={deco.rotation ?? 0} />}
          {deco.type === "sticker" && <Sticker type={deco.data.stickerType as StickerType} />}
          {deco.type === "waxSeal" && <WaxSeal />}
          {deco.type === "photo" && <Sticker type="heart" />}
        </div>
      ))}
    </div>
  )
}
