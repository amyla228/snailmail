"use client"

import { cn } from "@/lib/utils"

type StickerType = "heart" | "star" | "flower" | "butterfly" | "sun"

interface StickerProps {
  type: StickerType
  className?: string
}

const stickerSvgs: Record<StickerType, React.ReactNode> = {
  heart: (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <path
        d="M20 35 C10 25 2 18 2 12 C2 6 7 2 12 2 C16 2 19 5 20 7 C21 5 24 2 28 2 C33 2 38 6 38 12 C38 18 30 25 20 35Z"
        fill="#e8a0a0"
        stroke="#d48080"
        strokeWidth="0.5"
        opacity="0.85"
      />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <path
        d="M20 3 L24 15 L37 15 L27 23 L30 36 L20 28 L10 36 L13 23 L3 15 L16 15Z"
        fill="#f0d080"
        stroke="#d4b060"
        strokeWidth="0.5"
        opacity="0.85"
      />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <circle cx="20" cy="12" r="6" fill="#f0c4c8" opacity="0.8" />
      <circle cx="28" cy="18" r="6" fill="#f0c4c8" opacity="0.8" />
      <circle cx="26" cy="28" r="6" fill="#f0c4c8" opacity="0.8" />
      <circle cx="14" cy="28" r="6" fill="#f0c4c8" opacity="0.8" />
      <circle cx="12" cy="18" r="6" fill="#f0c4c8" opacity="0.8" />
      <circle cx="20" cy="20" r="5" fill="#f0e0a0" />
    </svg>
  ),
  butterfly: (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <ellipse cx="13" cy="15" rx="10" ry="8" fill="#b8d4c0" opacity="0.8" transform="rotate(-20 13 15)" />
      <ellipse cx="27" cy="15" rx="10" ry="8" fill="#b8d4c0" opacity="0.8" transform="rotate(20 27 15)" />
      <ellipse cx="13" cy="26" rx="7" ry="6" fill="#c8dcc8" opacity="0.7" transform="rotate(10 13 26)" />
      <ellipse cx="27" cy="26" rx="7" ry="6" fill="#c8dcc8" opacity="0.7" transform="rotate(-10 27 26)" />
      <line x1="20" y1="10" x2="20" y2="34" stroke="#7a6b5d" strokeWidth="1" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <circle cx="20" cy="20" r="8" fill="#f0d890" opacity="0.85" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="20"
          y1="20"
          x2={20 + 14 * Math.cos((angle * Math.PI) / 180)}
          y2={20 + 14 * Math.sin((angle * Math.PI) / 180)}
          stroke="#e8c060"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
    </svg>
  ),
}

export function Sticker({ type, className }: StickerProps) {
  return (
    <div className={cn("drop-shadow-sm", className)}>
      {stickerSvgs[type]}
    </div>
  )
}
