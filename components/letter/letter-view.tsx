"use client"

import { cn } from "@/lib/utils"
import { WashiTape } from "./washi-tape"
import { Sticker } from "./sticker"
import { Polaroid } from "./polaroid"
import type { SavedLetterState } from "@/lib/letter-store"

const inkColorMap: Record<SavedLetterState["inkColor"], string> = {
  brown: "var(--ink-brown)",
  navy: "var(--ink-navy)",
  black: "var(--ink-black)",
}

interface LetterViewProps {
  letter: SavedLetterState
  className?: string
}

export function LetterView({ letter, className }: LetterViewProps) {
  const textClass = letter.fontStyle === "handwriting" ? "font-mono" : "font-serif"

  return (
    <div
      className={cn("relative w-full rounded-lg overflow-hidden", className)}
      style={{
        backgroundColor: "var(--paper-soft)",
        boxShadow:
          "0 4px 24px rgba(58, 51, 48, 0.08), 0 1px 4px rgba(58, 51, 48, 0.05)",
        minHeight: "620px",
      }}
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
          className={cn("text-sm opacity-50", textClass)}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.date}
        </span>
      </div>

      <div className="relative z-[5] px-12 pt-5">
        <p
          className={cn(
            "w-full text-lg",
            textClass === "font-mono" ? "font-mono text-xl" : "font-serif italic"
          )}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.greeting || "Dear ..."}
        </p>
      </div>

      <div className="relative z-[5] px-12 pt-3 pb-6">
        <p
          className={cn(
            "w-full leading-8 min-h-[200px] whitespace-pre-wrap",
            textClass === "font-mono"
              ? "font-mono text-xl"
              : "font-serif text-base leading-relaxed"
          )}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.text}
        </p>
      </div>

      <div className="relative z-[5] px-12 pb-10 text-right">
        <p
          className={cn(
            "text-right w-48 ml-auto block",
            textClass === "font-mono" ? "font-mono text-xl" : "font-serif text-base italic"
          )}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.signature}
        </p>
        <div
          className="mt-1 ml-auto opacity-20"
          style={{
            width: "180px",
            height: "1px",
            backgroundColor: inkColorMap[letter.inkColor],
          }}
        />
      </div>

      {letter.decorations.map((deco) => (
        <div
          key={deco.id}
          className="absolute z-10 drop-shadow-sm pointer-events-none"
          style={{
            left: deco.x,
            top: deco.y,
          }}
        >
          {deco.type === "washi" && (
            <WashiTape
              color={deco.data.color as "pink" | "green" | "yellow" | "blue"}
              rotation={deco.rotation ?? 0}
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
              rotation={deco.rotation ?? 0}
            />
          )}
        </div>
      ))}
    </div>
  )
}
