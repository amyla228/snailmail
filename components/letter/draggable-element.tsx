"use client"

import { type RefObject } from "react"
import { useDraggable } from "@/hooks/use-draggable"
import { cn } from "@/lib/utils"

interface DraggableElementProps {
  containerRef: RefObject<HTMLElement | null>
  initialX: number
  initialY: number
  children: React.ReactNode
  className?: string
  onRemove?: () => void
  onPositionChange?: (x: number, y: number) => void
}

export function DraggableElement({
  containerRef,
  initialX,
  initialY,
  children,
  className,
  onRemove,
  onPositionChange,
}: DraggableElementProps) {
  const { position, isDragging, handlers } = useDraggable({
    initialPosition: { x: initialX, y: initialY },
    containerRef,
    onPositionChange: onPositionChange ? (pos) => onPositionChange(pos.x, pos.y) : undefined,
  })

  return (
    <div
      data-draggable-decoration
      className={cn(
        "absolute select-none touch-none group",
        isDragging ? "z-50 scale-105 drop-shadow-lg" : "z-10 drop-shadow-sm",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...handlers}
      onClick={(e) => e.stopPropagation()}
    >
      {onRemove && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-sans flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 pointer-events-auto"
          aria-label="Remove decoration"
        >
          ×
        </button>
      )}
      {children}
    </div>
  )
}
