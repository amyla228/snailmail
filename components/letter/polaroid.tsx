"use client"

import { cn } from "@/lib/utils"

interface PolaroidProps {
  src: string
  caption?: string
  rotation?: number
  className?: string
}

export function Polaroid({ src, caption, rotation = -3, className }: PolaroidProps) {
  return (
    <div
      className={cn(
        "bg-card p-2 pb-8 shadow-md w-32",
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || "Attached photo"}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>
      {caption && (
        <p className="text-center mt-2 text-sm font-mono text-muted-foreground">
          {caption}
        </p>
      )}
    </div>
  )
}
