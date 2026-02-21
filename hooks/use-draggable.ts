"use client"

import { useState, useCallback, useRef, type RefObject } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition: Position
  containerRef: RefObject<HTMLElement | null>
  onPositionChange?: (position: Position) => void
}

export function useDraggable({ initialPosition, containerRef, onPositionChange }: UseDraggableOptions) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })
  const lastPosition = useRef<Position>(initialPosition)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      dragOffset.current = {
        x: e.clientX - rect.left - lastPosition.current.x,
        y: e.clientY - rect.top - lastPosition.current.y,
      }
    },
    [containerRef]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const newX = e.clientX - rect.left - dragOffset.current.x
      const newY = e.clientY - rect.top - dragOffset.current.y

      const clampedX = Math.max(-20, Math.min(newX, rect.width - 20))
      const clampedY = Math.max(-20, Math.min(newY, rect.height - 20))

      const newPos = { x: clampedX, y: clampedY }
      lastPosition.current = newPos
      setPosition(newPos)
    },
    [isDragging, containerRef]
  )

  const handlePointerUp = useCallback(() => {
    if (isDragging && onPositionChange) {
      onPositionChange(lastPosition.current)
    }
    setIsDragging(false)
  }, [isDragging, onPositionChange])

  return {
    position,
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
