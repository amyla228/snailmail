"use client"

import { cn } from "@/lib/utils"
import { WashiTape } from "./washi-tape"
import { Sticker } from "./sticker"
import { Polaroid } from "./polaroid"
import { WaxSeal } from "./wax-seal"
import type { SavedLetterState, DoodleStroke } from "@/lib/letter-store"

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
  const letterBodyClass = letter.fontStyle === "handwriting" ? "font-letter-handwriting" : "font-serif"

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
          className={cn("text-sm opacity-50", letterBodyClass)}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.date}
        </span>
      </div>

      <div className="relative z-[5] px-12 pt-5">
        <p
          className={cn(
            "w-full text-base sm:text-lg",
            letterBodyClass,
            letter.fontStyle === "serif" && "italic"
          )}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.greeting || "Dear ..."}
        </p>
      </div>

      <div className="relative z-[5] px-12 pt-3 pb-6">
        <p
          className={cn(
            "w-full min-h-[200px] whitespace-pre-wrap text-base",
            letterBodyClass,
            letter.fontStyle === "handwriting" ? "leading-[1.7]" : "font-serif leading-relaxed"
          )}
          style={{ color: inkColorMap[letter.inkColor] }}
        >
          {letter.text}
        </p>
      </div>

      {(letter.additionalPages?.length ?? 0) > 0 &&
        letter.additionalPages!.map((page) => (
          <div key={page.id} className="relative z-[5] px-12 pt-3 pb-6">
            <p
              className={cn(
                "w-full min-h-[120px] whitespace-pre-wrap text-base",
                letterBodyClass,
                letter.fontStyle === "handwriting" ? "leading-[1.7]" : "font-serif leading-relaxed"
              )}
              style={{ color: inkColorMap[letter.inkColor] }}
            >
              {page.text}
            </p>
          </div>
        ))}

      <div className="relative z-[5] px-12 pb-10 text-right">
        <p
          className={cn(
            "text-right w-48 ml-auto block text-base sm:text-lg",
            letterBodyClass,
            letter.fontStyle === "serif" && "italic"
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
            transform: "translate(-50%, -50%)",
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
          {deco.type === "waxSeal" && <WaxSeal />}
        </div>
      ))}
      {(letter.letterDoodles?.length ?? 0) > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[6]" preserveAspectRatio="none">
          {letter.letterDoodles!.map((stroke, i) =>
            stroke.points.length > 1 ? (
              <polyline
                key={i}
                points={stroke.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={stroke.color ?? "var(--ink-brown)"}
                strokeWidth={stroke.width ?? 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null
          )}
        </svg>
      )}
    </div>
  )
}
