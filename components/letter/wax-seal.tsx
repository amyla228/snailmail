"use client"

import { cn } from "@/lib/utils"

interface WaxSealProps {
  className?: string
}

/** Circular wax seal (no map-pin shape). Use for placed seals and optional toolbar icon. */
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
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
        <path d="M12 6v4l2 6 2-6 2 4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
    </div>
  )
}

/** Small circular seal icon for toolbar only (no map pin). */
export function WaxSealToolbarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("w-5 h-5 text-foreground", className)} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v2l1.5 4 1.5-4 1.5 2" />
    </svg>
  )
}
