"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { SavedLetterState, DecoElement, LetterPage } from "@/lib/letter-store"
import { DraggableElement } from "./draggable-element"
import { WashiTape } from "./washi-tape"
import { Sticker } from "./sticker"
import { Polaroid } from "./polaroid"
import { Toolbar } from "./toolbar"

type InkColor = SavedLetterState["inkColor"]
type FontStyle = SavedLetterState["fontStyle"]

const inkColorMap: Record<InkColor, string> = {
  brown: "var(--ink-brown)",
  navy: "var(--ink-navy)",
  black: "var(--ink-black)",
}

const PLACEHOLDER_ROTATION: Record<DecoElement["type"], number> = {
  washi: -6,
  sticker: 0,
  photo: -3,
}

const TOOLBAR_HEIGHT_PX = 80
const BOTTOM_PADDING_PX = 24

interface LetterCanvasProps {
  onSeal: (state: SavedLetterState) => void
}

export function LetterCanvas({ onSeal }: LetterCanvasProps) {
  const [letterText, setLetterText] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [signature, setSignature] = useState("")
  const [additionalPages, setAdditionalPages] = useState<LetterPage[]>([])
  const [inkColor, setInkColor] = useState<InkColor>("brown")
  const [fontStyle, setFontStyle] = useState<FontStyle>("handwriting")
  const [decorations, setDecorations] = useState<DecoElement[]>([])
  const [pendingDecoration, setPendingDecoration] = useState<{
    type: DecoElement["type"]
    data: Record<string, string>
  } | null>(null)
  const [placePosition, setPlacePosition] = useState({ x: 100, y: 80 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const pagesEndRef = useRef<HTMLDivElement>(null)

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const placeDecoration = useCallback(
    (clientX: number, clientY: number) => {
      if (!pendingDecoration || !canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const id = `${pendingDecoration.type}-${Date.now()}`
      const rotation = PLACEHOLDER_ROTATION[pendingDecoration.type]
      setDecorations((prev) => [
        ...prev,
        { id, type: pendingDecoration.type, data: pendingDecoration.data, x, y, rotation },
      ])
      setPendingDecoration(null)
    },
    [pendingDecoration]
  )

  const startPlacement = useCallback((type: DecoElement["type"], data: Record<string, string> = {}) => {
    setPendingDecoration({ type, data })
  }, [])

  const removeDecoration = useCallback((id: string) => {
    setDecorations((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const updateDecorationPosition = useCallback((id: string, x: number, y: number) => {
    setDecorations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, x, y } : d))
    )
  }, [])

  const addPage = useCallback(() => {
    const id = `page-${Date.now()}`
    setAdditionalPages((prev) => [...prev, { id, text: "" }])
    setTimeout(() => pagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }, [])

  const updatePageText = useCallback((id: string, text: string) => {
    setAdditionalPages((prev) => prev.map((p) => (p.id === id ? { ...p, text } : p)))
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      setPlacePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!pendingDecoration) return
      if ((e.target as HTMLElement).closest("[data-draggable-decoration]")) return
      placeDecoration(e.clientX, e.clientY)
    },
    [pendingDecoration, placeDecoration]
  )

  const handleSeal = () => {
    if (!letterText.trim()) return
    const toLine = recipientName.trim() ? `Dear ${recipientName.trim()}` : "Dear …"
    onSeal({
      text: letterText,
      date: today,
      greeting: toLine,
      signature,
      recipientName: recipientName.trim() || undefined,
      inkColor,
      fontStyle,
      decorations: decorations.map((d) => ({
        id: d.id,
        type: d.type,
        data: d.data,
        x: d.x,
        y: d.y,
        rotation: d.rotation,
      })),
      additionalPages: additionalPages.length > 0 ? additionalPages : undefined,
    })
  }

  const letterBodyClass = fontStyle === "handwriting" ? "font-letter-handwriting" : "font-serif"
  const hasContent = letterText.trim().length > 0

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4">
      {/* Scrollable letter area — padding-bottom so content doesn't sit under sticky toolbar */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: TOOLBAR_HEIGHT_PX + BOTTOM_PADDING_PX + 24 }}
      >
        <div className="flex flex-col items-center gap-6 pt-2">
          {/* Page 1 */}
          <div
            ref={canvasRef}
            className={cn(
              "relative w-full rounded-lg overflow-hidden",
              pendingDecoration && "cursor-crosshair"
            )}
            style={{
              backgroundColor: "var(--paper-soft)",
              boxShadow:
                "0 4px 24px rgba(58, 51, 48, 0.08), 0 1px 4px rgba(58, 51, 48, 0.05)",
              minHeight: "520px",
            }}
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, #d4856a 31px, #d4856a 32px)",
                backgroundPositionY: "152px",
              }}
            />
            <div
              className="absolute top-0 bottom-0 pointer-events-none opacity-[0.08]"
              style={{
                left: "48px",
                width: "1px",
                backgroundColor: "#d4856a",
              }}
            />

            <div className="relative z-[5] pt-8 px-12 text-right">
              <span
                className={cn("text-sm opacity-50", letterBodyClass)}
                style={{ color: inkColorMap[inkColor] }}
              >
                {today}
              </span>
            </div>

            <div className="relative z-[5] px-12 pt-5">
              <div className="flex flex-wrap items-baseline gap-1">
                <span
                  className={cn(letterBodyClass, fontStyle === "serif" && "italic")}
                  style={{ color: inkColorMap[inkColor] }}
                >
                  Dear
                </span>
                <input
                  id="recipient-field"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient"
                  className={cn(
                    "flex-1 min-w-[120px] bg-transparent focus:outline-none placeholder:opacity-25 text-base sm:text-lg",
                    letterBodyClass,
                    fontStyle === "serif" && "italic"
                  )}
                  style={{
                    color: inkColorMap[inkColor],
                    caretColor: inkColorMap[inkColor],
                  }}
                  aria-label="Recipient name"
                />
              </div>
            </div>

            <div className="relative z-[5] px-12 pt-3 pb-6">
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Write your heart out..."
                className={cn(
                  "w-full bg-transparent resize-none focus:outline-none placeholder:opacity-20 min-h-[280px] text-base",
                  letterBodyClass,
                  fontStyle === "handwriting" ? "leading-[1.7]" : "font-serif leading-relaxed"
                )}
                style={{
                  color: inkColorMap[inkColor],
                  caretColor: inkColorMap[inkColor],
                }}
                aria-label="Letter content"
              />
            </div>

            <div className="relative z-[5] px-12 pb-10 text-right">
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Your name"
                className={cn(
                  "bg-transparent text-right focus:outline-none placeholder:opacity-25 w-48 ml-auto block text-base sm:text-lg",
                  letterBodyClass,
                  fontStyle === "serif" && "italic"
                )}
                style={{
                  color: inkColorMap[inkColor],
                  caretColor: inkColorMap[inkColor],
                }}
                aria-label="Signature"
              />
            </div>

            {pendingDecoration && (
              <div
                className="absolute z-[60] pointer-events-none"
                style={{
                  left: placePosition.x,
                  top: placePosition.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {pendingDecoration.type === "washi" && (
                  <WashiTape
                    color={pendingDecoration.data.color as "pink" | "green" | "yellow" | "blue"}
                    rotation={PLACEHOLDER_ROTATION.washi}
                  />
                )}
                {pendingDecoration.type === "sticker" && (
                  <Sticker
                    type={
                      pendingDecoration.data.stickerType as
                        | "heart"
                        | "star"
                        | "flower"
                        | "butterfly"
                        | "sun"
                    }
                  />
                )}
                {pendingDecoration.type === "photo" && (
                  <Polaroid
                    src={pendingDecoration.data.src || ""}
                    rotation={PLACEHOLDER_ROTATION.photo}
                  />
                )}
              </div>
            )}

            {decorations.map((deco) => (
              <DraggableElement
                key={deco.id}
                containerRef={canvasRef}
                initialX={deco.x}
                initialY={deco.y}
                onRemove={() => removeDecoration(deco.id)}
                onPositionChange={(x, y) => updateDecorationPosition(deco.id, x, y)}
              >
                <div data-draggable-decoration>
                  {deco.type === "washi" && (
                    <WashiTape
                      color={deco.data.color as "pink" | "green" | "yellow" | "blue"}
                      rotation={deco.rotation ?? PLACEHOLDER_ROTATION.washi}
                    />
                  )}
                  {deco.type === "sticker" && (
                    <Sticker
                      type={
                        deco.data.stickerType as
                          | "heart"
                          | "star"
                          | "flower"
                          | "butterfly"
                          | "sun"
                      }
                    />
                  )}
                  {deco.type === "photo" && (
                    <Polaroid
                      src={deco.data.src || ""}
                      rotation={deco.rotation ?? PLACEHOLDER_ROTATION.photo}
                    />
                  )}
                </div>
              </DraggableElement>
            ))}
          </div>

          {/* Additional pages */}
          {additionalPages.map((page) => (
            <div
              key={page.id}
              className="relative w-full rounded-lg overflow-hidden"
              style={{
                backgroundColor: "var(--paper-soft)",
                boxShadow:
                  "0 4px 24px rgba(58, 51, 48, 0.08), 0 1px 4px rgba(58, 51, 48, 0.05)",
                minHeight: "400px",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 31px, #d4856a 31px, #d4856a 32px)",
                  backgroundPositionY: "32px",
                }}
              />
              <div
                className="absolute top-0 bottom-0 pointer-events-none opacity-[0.08]"
                style={{
                  left: "48px",
                  width: "1px",
                  backgroundColor: "#d4856a",
                }}
              />
              <div className="relative z-[5] px-12 py-8">
                <textarea
                  value={page.text}
                  onChange={(e) => updatePageText(page.id, e.target.value)}
                  placeholder="Continue your letter..."
                  className={cn(
                    "w-full bg-transparent resize-none focus:outline-none placeholder:opacity-20 min-h-[320px] text-base",
                    letterBodyClass,
                    fontStyle === "handwriting" ? "leading-[1.7]" : "font-serif leading-relaxed"
                  )}
                  style={{
                    color: inkColorMap[inkColor],
                    caretColor: inkColorMap[inkColor],
                  }}
                  aria-label="Letter page"
                />
              </div>
            </div>
          ))}

          {/* Add page button */}
          <div ref={pagesEndRef} className="flex justify-center w-full py-2">
            <button
              type="button"
              onClick={addPage}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Add another page"
              title="Add another page"
            >
              <span className="text-2xl leading-none">+</span>
            </button>
          </div>

          {/* Seal Letter — only primary action */}
          <div className="flex justify-center w-full pt-2">
            <button
              onClick={handleSeal}
              disabled={!hasContent}
              className={cn(
                "group relative px-8 py-3 rounded-xl font-serif text-base transition-all duration-300",
                "bg-primary text-primary-foreground shadow-lg",
                "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              )}
            >
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
                Seal Letter
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky toolbar — always visible at bottom */}
      <div
        className="fixed left-0 right-0 flex justify-center py-3 safe-area-pb"
        style={{
          bottom: 0,
          paddingBottom: Math.max(BOTTOM_PADDING_PX, 12),
          backgroundColor: "rgba(250, 247, 245, 0.92)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(229, 221, 216, 0.6)",
        }}
      >
        <Toolbar
          inkColor={inkColor}
          onInkColorChange={setInkColor}
          fontStyle={fontStyle}
          onFontStyleChange={setFontStyle}
          onAddSticker={(type) => startPlacement("sticker", { stickerType: type })}
          onAddWashi={(color) => startPlacement("washi", { color })}
          onAddPhoto={(src) => startPlacement("photo", { src })}
        />
      </div>
    </div>
  )
}
