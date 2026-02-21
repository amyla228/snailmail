"use client"

import { cn } from "@/lib/utils"

type WashiColor = "pink" | "green" | "yellow" | "blue"

interface WashiTapeProps {
  color: WashiColor
  rotation?: number
  className?: string
}

const colorMap: Record<WashiColor, string> = {
  pink: "bg-washi-pink",
  green: "bg-washi-green",
  yellow: "bg-washi-yellow",
  blue: "bg-washi-blue",
}

const patternMap: Record<WashiColor, string> = {
  pink: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 8px)",
  green: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 6px)",
  yellow: "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 7px)",
  blue: "repeating-linear-gradient(135deg, transparent, transparent 5px, rgba(255,255,255,0.35) 5px, rgba(255,255,255,0.35) 7px)",
}

export function WashiTape({ color, rotation = 0, className }: WashiTapeProps) {
  return (
    <div
      className={cn(
        "w-28 h-7 rounded-sm opacity-75",
        colorMap[color],
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundImage: patternMap[color],
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    />
  )
}
