"use client"

import { cn } from "@/lib/utils"

interface WaxSealProps {
  className?: string
}

export function WaxSeal({ className }: WaxSealProps) {
  return (
    <div
      className={cn("w-12 h-12 rounded-full flex items-center justify-center drop-shadow-md", className)}
      style={{
        background: "radial-gradient(circle at 30% 30%, #c45c5c, #8b2a2a 60%, #6b2020)",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
        border: "1px solid rgba(139,42,42,0.5)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/90" fill="currentColor">
        <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 5 6 10 4.5-5 6-7.5 6-10 0-3.5-2.5-6-6-6zm0 8.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 5.5 12 5.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
      </svg>
    </div>
  )
}
