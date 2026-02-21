"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { SavedLetterState, DecoElement } from "@/lib/letter-store"
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

interface LetterCanvasProps {
  onSeal: (state: SavedLetterState) => void
}

export function LetterCanvas({ onSeal }: LetterCanvasProps) {
  const [letterText, setLetterText] = useState("")
  const [greeting, setGreeting] = useState("")
  const [signature, setSignature] = useState("")
  const [inkColor, setInkColor] = useState<InkColor>("brown")
  const [fontStyle, setFontStyle] = useState<FontStyle>("handwriting")
  const [decorations, setDecorations] = useState<DecoElement[]>([])
  const [pendingDecoration, setPendingDecoration] = useState<{
    type: DecoElement["type"]
    data: Record<string, string>
  } | null>(null)
  const [placePosition, setPlacePosition] = useState({ x: 100, y: 80 })
  const canvasRef = useRef<HTMLDivElement>(null)

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
    onSeal({
      text: letterText,
      date: today,
      greeting,
      signature,
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
    })
  }

  const textClass = fontStyle === "handwriting" ? "font-mono" : "font-serif"

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
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
          minHeight: "620px",
        }}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
      >
        {/* Subtle ruled lines */}
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

        {/* Date */}
        <div className="relative z-[5] pt-8 px-12 text-right">
          <span
            className={cn("text-sm opacity-50", textClass)}
            style={{ color: inkColorMap[inkColor] }}
          >
            {today}
          </span>
        </div>

        {/* Editable Greeting */}
        <div className="relative z-[5] px-12 pt-5">
          <input
            type="text"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Dear ..."
            className={cn(
              "w-full bg-transparent focus:outline-none placeholder:opacity-25 text-lg",
              textClass === "font-mono" ? "font-mono text-xl" : "font-serif italic"
            )}
            style={{
              color: inkColorMap[inkColor],
              caretColor: inkColorMap[inkColor],
            }}
            aria-label="Greeting"
          />
        </div>

        {/* Text Area */}
        <div className="relative z-[5] px-12 pt-3 pb-6">
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            placeholder="Write your heart out..."
            className={cn(
              "w-full bg-transparent resize-none focus:outline-none leading-8 placeholder:opacity-20 min-h-[340px]",
              textClass === "font-mono"
                ? "font-mono text-xl"
                : "font-serif text-base leading-relaxed"
            )}
            style={{
              color: inkColorMap[inkColor],
              caretColor: inkColorMap[inkColor],
            }}
            aria-label="Letter content"
          />
        </div>

        {/* Editable Signature */}
        <div className="relative z-[5] px-12 pb-10 text-right">
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Your name"
            className={cn(
              "bg-transparent text-right focus:outline-none placeholder:opacity-25 w-48 ml-auto block",
              textClass === "font-mono" ? "font-mono text-xl" : "font-serif text-base italic"
            )}
            style={{
              color: inkColorMap[inkColor],
              caretColor: inkColorMap[inkColor],
            }}
            aria-label="Signature"
          />
          <div
            className="mt-1 ml-auto opacity-20"
            style={{
              width: "180px",
              height: "1px",
              backgroundColor: inkColorMap[inkColor],
            }}
          />
        </div>

        {/* Cursor-attached preview (place mode) */}
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

        {/* Placed decorations — draggable */}
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

      <Toolbar
        inkColor={inkColor}
        onInkColorChange={setInkColor}
        fontStyle={fontStyle}
        onFontStyleChange={setFontStyle}
        onAddSticker={(type) => startPlacement("sticker", { stickerType: type })}
        onAddWashi={(color) => startPlacement("washi", { color })}
        onAddPhoto={(src) => startPlacement("photo", { src })}
      />

      <button
        onClick={handleSeal}
        disabled={!letterText.trim()}
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
          Seal & Send
        </span>
      </button>
    </div>
  )
}
