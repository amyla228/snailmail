"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { SavedLetterState, DecoElement, DoodleStroke } from "@/lib/letter-store"
import { supabase } from "@/lib/supabase"
import { DraggableElement } from "./draggable-element"
import { WashiTape } from "./washi-tape"
import { Sticker } from "./sticker"
import { WaxSeal, WaxSealToolbarIcon } from "./wax-seal"
import { Palette, Pencil, Sticker as StickerIcon } from "lucide-react"

const ENVELOPE_COLORS = [
  { id: "cream", hex: "#fef3ed" },
  { id: "sand", hex: "#f5e6d3" },
  { id: "mint", hex: "#e8f4e8" },
  { id: "sky", hex: "#e3e8f4" },
  { id: "blush", hex: "#fce4ec" },
] as const

const PLACEHOLDER_ROTATION: Record<DecoElement["type"], number> = {
  washi: -6,
  sticker: 0,
  photo: -3,
  waxSeal: 0,
}

type StickerType = "heart" | "star" | "flower" | "butterfly" | "sun"

interface EnvelopePreviewProps {
  /** Letter state; if no id, we save to Supabase on Send Letter then open Gmail */
  letter: SavedLetterState & { id?: string }
  onNewLetter: () => void
}

export function EnvelopePreview({ letter, onNewLetter }: EnvelopePreviewProps) {
  const [sending, setSending] = useState(false)
  const [toEmail, setToEmail] = useState("")
  const [envelopeColor, setEnvelopeColor] = useState(letter.envelopeColor ?? "#fef3ed")
  const [envelopeDecorations, setEnvelopeDecorations] = useState<DecoElement[]>(letter.envelopeDecorations ?? [])
  const [envelopeDoodles, setEnvelopeDoodles] = useState<DoodleStroke[]>(letter.envelopeDoodles ?? [])
  const [isDoodleMode, setIsDoodleMode] = useState(false)
  const [currentDoodleStroke, setCurrentDoodleStroke] = useState<{ x: number; y: number }[]>([])
  const [pendingDecoration, setPendingDecoration] = useState<{ type: DecoElement["type"]; data: Record<string, string> } | null>(null)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const envelopeRef = useRef<HTMLDivElement>(null)
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([])
  const isDrawingRef = useRef(false)

  const getEnvelopeCoords = useCallback((clientX: number, clientY: number) => {
    if (!envelopeRef.current) return null
    const rect = envelopeRef.current.getBoundingClientRect()
    return { x: Math.max(0, Math.min(rect.width, clientX - rect.left)), y: Math.max(0, Math.min(rect.height, clientY - rect.top)) }
  }, [])

  const placeDecoration = useCallback((clientX: number, clientY: number) => {
    if (!pendingDecoration || !envelopeRef.current) return
    const rect = envelopeRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const id = `${pendingDecoration.type}-${Date.now()}`
    const rotation = PLACEHOLDER_ROTATION[pendingDecoration.type]
    setEnvelopeDecorations((prev) => [...prev, { id, type: pendingDecoration.type, data: pendingDecoration.data, x, y, rotation }])
    setPendingDecoration(null)
    setOpenPanel(null)
  }, [pendingDecoration])

  const removeDecoration = useCallback((id: string) => {
    setEnvelopeDecorations((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const updateDecorationPosition = useCallback((id: string, x: number, y: number) => {
    setEnvelopeDecorations((prev) => prev.map((d) => (d.id === id ? { ...d, x, y } : d)))
  }, [])

  const handleEnvelopeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-draggable-decoration]")) return
    if (pendingDecoration) placeDecoration(e.clientX, e.clientY)
  }, [pendingDecoration, placeDecoration])

  const handleDoodleDown = useCallback((e: React.PointerEvent) => {
    if (!isDoodleMode) return
    e.preventDefault()
    isDrawingRef.current = true
    const coords = getEnvelopeCoords(e.clientX, e.clientY)
    if (coords) { currentStrokeRef.current = [coords]; setCurrentDoodleStroke([coords]) }
  }, [isDoodleMode, getEnvelopeCoords])

  const handleDoodleMove = useCallback((e: React.PointerEvent) => {
    if (!isDoodleMode || !isDrawingRef.current) return
    e.preventDefault()
    const coords = getEnvelopeCoords(e.clientX, e.clientY)
    if (!coords) return
    currentStrokeRef.current = [...currentStrokeRef.current, coords]
    setCurrentDoodleStroke(currentStrokeRef.current)
  }, [isDoodleMode, getEnvelopeCoords])

  const handleDoodleUp = useCallback(() => {
    isDrawingRef.current = false
    const stroke = currentStrokeRef.current
    if (stroke.length > 1) setEnvelopeDoodles((prev) => [...prev, { points: [...stroke] }])
    currentStrokeRef.current = []
    setCurrentDoodleStroke([])
  }, [])

  const handleSendLetter = async () => {
    const mergedLetter: SavedLetterState & { id?: string } = {
      ...letter,
      envelopeColor: envelopeColor || undefined,
      envelopeDecorations: envelopeDecorations.length > 0 ? envelopeDecorations : undefined,
      envelopeDoodles: envelopeDoodles.length > 0 ? envelopeDoodles : undefined,
    }
    let id = mergedLetter.id
    if (!id) {
      setSending(true)
      try {
        const payload = {
          to_name: mergedLetter.recipientName?.trim() || "A friend",
          from_name: mergedLetter.signature?.trim() || "",
          content: JSON.stringify(mergedLetter),
        }
        const { data, error } = await supabase.from("letters").insert(payload).select("id").single()
        if (error) { console.error("Error saving letter:", error); setSending(false); return }
        id = data?.id as string | undefined
        if (!id) { setSending(false); return }
      } finally { setSending(false) }
    }
    if (!id) return
    const shareUrl = `${window.location.origin}/letter/${id}`
    const params = new URLSearchParams({ view: "cm", fs: "1", su: "New Letter from your Pen Pal 💌", body: `Copy and paste this link into your browser to read my letter:\n${shareUrl}` })
    if (toEmail.trim()) params.set("to", toEmail.trim())
    window.open(`https://mail.google.com/mail/?${params.toString()}`, "_blank", "noopener,noreferrer")
  }

  const toName = letter.recipientName?.trim() || "—"
  const fromName = letter.signature?.trim() || "—"

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 animate-fade-in-up min-h-[60vh] pb-24">
      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        <div
          ref={envelopeRef}
          className={cn(
            "w-full rounded-2xl overflow-hidden relative border flex flex-col items-center justify-center py-10 px-8",
            pendingDecoration && "cursor-crosshair"
          )}
          style={{
            backgroundColor: envelopeColor,
            borderColor: "rgba(229, 221, 216, 0.8)",
            boxShadow: "0 6px 24px rgba(58, 51, 48, 0.08)",
            aspectRatio: "4 / 3",
          }}
          onClick={handleEnvelopeClick}
        >
          <div
            className="absolute inset-0 z-[5]"
            style={{ pointerEvents: isDoodleMode ? "auto" : "none" }}
            onPointerDown={handleDoodleDown}
            onPointerMove={handleDoodleMove}
            onPointerUp={handleDoodleUp}
            onPointerLeave={handleDoodleUp}
            onPointerCancel={handleDoodleUp}
          >
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {envelopeDoodles.map((stroke, i) =>
                stroke.points.length > 1 ? (
                  <polyline key={i} points={stroke.points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : null
              )}
              {currentDoodleStroke.length > 1 && (
                <polyline points={currentDoodleStroke.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>

          <div className="relative z-[2] flex flex-col gap-5 text-center font-serif text-lg text-foreground">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="text-muted-foreground">To:</span>
              <span>{toName}</span>
              <span className="text-muted-foreground">(</span>
              <input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="enter email"
                className="flex-1 min-w-[140px] max-w-[200px] rounded border border-border bg-background/80 px-2 py-1 text-base font-serif text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="Recipient email"
              />
              <span className="text-muted-foreground">)</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">From:</span>
              <span>{fromName}</span>
            </div>
          </div>

          {envelopeDecorations.map((deco) => (
            <DraggableElement
              key={deco.id}
              containerRef={envelopeRef}
              initialX={deco.x}
              initialY={deco.y}
              onRemove={() => removeDecoration(deco.id)}
              onPositionChange={(x, y) => updateDecorationPosition(deco.id, x, y)}
            >
              <div data-draggable-decoration>
                {deco.type === "washi" && <WashiTape color={deco.data.color as "pink" | "green" | "yellow" | "blue"} rotation={deco.rotation ?? PLACEHOLDER_ROTATION.washi} />}
                {deco.type === "sticker" && <Sticker type={deco.data.stickerType as StickerType} />}
                {deco.type === "waxSeal" && <WaxSeal />}
                {deco.type === "photo" && <Sticker type="heart" />}
              </div>
            </DraggableElement>
          ))}
        </div>
      </div>

      {/* Envelope editing toolbar + Send Letter */}
      <div
        className="fixed left-0 right-0 flex items-center justify-center gap-4 py-3 safe-area-pb"
        style={{ bottom: 0, paddingBottom: Math.max(28, 12), backgroundColor: "rgba(250, 247, 245, 0.92)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(229, 221, 216, 0.6)", zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-3 relative">
          <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-border">
            <button onClick={() => setOpenPanel(openPanel === "color" ? null : "color")} className={cn("p-2.5 rounded-xl transition-colors hover:bg-secondary", openPanel === "color" && "bg-secondary")} aria-label="Envelope color" title="Envelope color">
              <Palette className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button onClick={() => { setIsDoodleMode(!isDoodleMode); setOpenPanel(null) }} className={cn("p-2.5 rounded-xl transition-colors hover:bg-secondary", isDoodleMode && "bg-secondary")} aria-label="Doodle" title="Doodle">
              <Pencil className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button onClick={() => setOpenPanel(openPanel === "stickers" ? null : "stickers")} className={cn("p-2.5 rounded-xl transition-colors hover:bg-secondary", openPanel === "stickers" && "bg-secondary")} aria-label="Stickers" title="Stickers">
              <StickerIcon className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button onClick={() => { setPendingDecoration({ type: "waxSeal", data: {} }); setOpenPanel(null) }} className={cn("p-2.5 rounded-xl transition-colors hover:bg-secondary", pendingDecoration?.type === "waxSeal" && "bg-secondary")} aria-label="Wax seal" title="Wax seal">
              <WaxSealToolbarIcon />
            </button>
          </div>
          {openPanel === "color" && (
            <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
              <p className="text-xs text-muted-foreground mb-3 font-serif">Envelope color</p>
              <div className="flex gap-3">
                {ENVELOPE_COLORS.map((c) => (
                  <button key={c.id} onClick={() => { setEnvelopeColor(c.hex); setOpenPanel(null) }} className={cn("w-9 h-9 rounded-full border-2 transition-all hover:scale-110", envelopeColor === c.hex ? "border-primary scale-110 shadow-md" : "border-border")} style={{ backgroundColor: c.hex }} aria-label={c.id} />
                ))}
              </div>
            </div>
          )}
          {openPanel === "stickers" && (
            <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
              <p className="text-xs text-muted-foreground mb-3 font-serif">Stickers</p>
              <div className="flex gap-2">
                {(["heart", "star", "flower", "butterfly", "sun"] as StickerType[]).map((type) => (
                  <button key={type} onClick={() => { setPendingDecoration({ type: "sticker", data: { stickerType: type } }); setOpenPanel(null) }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-secondary text-lg" aria-label={`${type} sticker`}>
                    {type === "heart" && <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 21 C6 15 1 11 1 7 C1 3 4 1 7 1 C9 1 11 3 12 4 C13 3 15 1 17 1 C20 1 23 3 23 7 C23 11 18 15 12 21Z" fill="#e8a0a0"/></svg>}
                    {type === "star" && <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2 L14 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L10 9Z" fill="#f0d080"/></svg>}
                    {type === "flower" && <svg viewBox="0 0 24 24" className="w-6 h-6"><circle cx="12" cy="7" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="17" cy="11" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="15" cy="17" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="9" cy="17" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="7" cy="11" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="12" cy="12" r="3" fill="#f5e5a8"/></svg>}
                    {type === "butterfly" && <svg viewBox="0 0 24 24" className="w-6 h-6"><ellipse cx="8" cy="9" rx="6" ry="5" fill="#c2dcc8" opacity="0.8" transform="rotate(-20 8 9)"/><ellipse cx="16" cy="9" rx="6" ry="5" fill="#c2dcc8" opacity="0.8" transform="rotate(20 16 9)"/><line x1="12" y1="6" x2="12" y2="20" stroke="#8a817c" strokeWidth="0.8"/></svg>}
                    {type === "sun" && <svg viewBox="0 0 24 24" className="w-6 h-6"><circle cx="12" cy="12" r="5" fill="#f5e5a8" opacity="0.85"/>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="12" y1="12" x2={12 + 9 * Math.cos((a * Math.PI) / 180)} y2={12 + 9 * Math.sin((a * Math.PI) / 180)} stroke="#e8c060" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>)}</svg>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="button" onClick={handleSendLetter} disabled={sending} className={cn("shrink-0 px-6 py-2.5 rounded-xl font-serif text-base transition-all border-2 flex items-center justify-center gap-2", "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-md hover:shadow-lg", "disabled:opacity-60 disabled:cursor-wait")}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
          {sending ? "Saving…" : "Send Letter"}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-xs text-muted-foreground text-center font-serif">This will open your email with the letter link included.</p>
        <button type="button" onClick={onNewLetter} className="px-6 py-2.5 rounded-xl font-serif text-sm transition-all bg-secondary text-secondary-foreground hover:bg-border">Write Another Letter</button>
      </div>
    </div>
  )
}
