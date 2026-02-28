"use client"

import { cn } from "@/lib/utils"
import {
  Palette,
  ImagePlus,
  Sparkles,
  Sticker as StickerIcon,
  Type,
  Pencil,
} from "lucide-react"
import { useState, useRef } from "react"

type InkColor = "brown" | "navy" | "black"
type FontStyle = "handwriting" | "serif"
type StickerType = "heart" | "star" | "flower" | "butterfly" | "sun"
type WashiColor = "pink" | "green" | "yellow" | "blue"

interface ToolbarProps {
  inkColor: InkColor
  onInkColorChange: (color: InkColor) => void
  fontStyle: FontStyle
  onFontStyleChange: (style: FontStyle) => void
  onAddSticker: (type: StickerType) => void
  onAddWashi: (color: WashiColor) => void
  onAddPhoto: (src: string) => void
  isDoodleMode?: boolean
  onDoodleModeChange?: (active: boolean) => void
  /** Controlled: which panel is open (ink | font | washi | stickers). When user clicks a tool, parent sets this. */
  openPanel?: string | null
  /** Called when user clicks a tool button. Parent should set active tool, clear pending decoration, set doodle mode, and update openPanel. */
  onToolClick?: (tool: "ink" | "font" | "washi" | "stickers" | "doodle" | "photo") => void
  /** Called when user makes a selection in a panel (e.g. ink color, font) so parent can close the panel. */
  onClosePanel?: () => void
}

const inkColors: { id: InkColor; label: string; hex: string }[] = [
  { id: "brown", label: "Dark Brown", hex: "#4a3728" },
  { id: "navy", label: "Navy", hex: "#2a3a5c" },
  { id: "black", label: "Charcoal", hex: "#3a3330" },
]

export function Toolbar({
  inkColor,
  onInkColorChange,
  fontStyle,
  onFontStyleChange,
  onAddSticker,
  onAddWashi,
  onAddPhoto,
  isDoodleMode = false,
  onDoodleModeChange,
  openPanel = null,
  onToolClick,
  onClosePanel,
}: ToolbarProps) {
  const [internalOpenPanel, setInternalOpenPanel] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isControlled = onToolClick != null
  const effectiveOpenPanel = isControlled ? (openPanel ?? null) : internalOpenPanel

  const togglePanel = (panel: string) => {
    if (isControlled) {
      if (effectiveOpenPanel === panel) onClosePanel?.()
      else onToolClick(panel as "ink" | "font" | "washi" | "stickers")
    } else {
      setInternalOpenPanel((prev) => (prev === panel ? null : panel))
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === "string") {
        onAddPhoto(result)
        onClosePanel?.()
      }
    }
    reader.readAsDataURL(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 relative">
      <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-border">
        {/* Ink Color */}
        <button
          onClick={() => togglePanel("ink")}
          className={cn(
            "p-2.5 rounded-xl transition-colors hover:bg-secondary",
            effectiveOpenPanel === "ink" && "bg-secondary"
          )}
          aria-label="Ink color"
          title="Ink color"
        >
          <Palette className="w-5 h-5 text-foreground" />
        </button>

        {/* Font Style */}
        <button
          onClick={() => togglePanel("font")}
          className={cn(
            "p-2.5 rounded-xl transition-colors hover:bg-secondary",
            effectiveOpenPanel === "font" && "bg-secondary"
          )}
          aria-label="Font style"
          title="Font style"
        >
          <Type className="w-5 h-5 text-foreground" />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Washi Tape */}
        <button
          onClick={() => togglePanel("washi")}
          className={cn(
            "p-2.5 rounded-xl transition-colors hover:bg-secondary",
            effectiveOpenPanel === "washi" && "bg-secondary"
          )}
          aria-label="Washi tape"
          title="Washi tape"
        >
          <Sparkles className="w-5 h-5 text-foreground" />
        </button>

        {/* Stickers */}
        <button
          onClick={() => togglePanel("stickers")}
          className={cn(
            "p-2.5 rounded-xl transition-colors hover:bg-secondary",
            effectiveOpenPanel === "stickers" && "bg-secondary"
          )}
          aria-label="Stickers"
          title="Stickers"
        >
          <StickerIcon className="w-5 h-5 text-foreground" />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Doodle / Draw */}
        {onDoodleModeChange && (
          <button
            onClick={() => (onToolClick ? onToolClick("doodle") : onDoodleModeChange(!isDoodleMode))}
            className={cn(
              "p-2.5 rounded-xl transition-colors hover:bg-secondary",
              isDoodleMode && "bg-secondary"
            )}
            aria-label="Doodle"
            title="Doodle on letter"
          >
            <Pencil className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div className="w-px h-6 bg-border" />

        {/* Photo Upload */}
        <button
          onClick={() => {
            onToolClick?.("photo")
            fileInputRef.current?.click()
          }}
          className={cn(
            "p-2.5 rounded-xl transition-colors hover:bg-secondary",
            openPanel === "photo" && "bg-secondary"
          )}
          aria-label="Upload photo"
          title="Add photo"
        >
          <ImagePlus className="w-5 h-5 text-foreground" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
          aria-label="Choose photo file"
        />
      </div>

      {/* Panels */}
      {effectiveOpenPanel === "ink" && (
        <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
          <p className="text-xs text-muted-foreground mb-3 font-serif">Ink Color</p>
          <div className="flex gap-3">
            {inkColors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  onInkColorChange(color.id)
                  onClosePanel?.()
                }}
                className={cn(
                  "w-9 h-9 rounded-full border-2 transition-all hover:scale-110",
                  inkColor === color.id ? "border-primary scale-110 shadow-md" : "border-border"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.label}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}

      {effectiveOpenPanel === "font" && (
        <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
          <p className="text-xs text-muted-foreground mb-3 font-serif">Style</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onFontStyleChange("handwriting"); onClosePanel?.() }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm border transition-all",
                fontStyle === "handwriting"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground border-border hover:bg-secondary"
              )}
            >
              <span className="font-mono">Handwritten</span>
            </button>
            <button
              onClick={() => { onFontStyleChange("serif"); onClosePanel?.() }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm border transition-all",
                fontStyle === "serif"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground border-border hover:bg-secondary"
              )}
            >
              <span className="font-serif">Classic</span>
            </button>
          </div>
        </div>
      )}

      {effectiveOpenPanel === "washi" && (
        <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
          <p className="text-xs text-muted-foreground mb-3 font-serif">Washi Tape</p>
          <div className="flex gap-2">
            {(["pink", "green", "yellow", "blue"] as WashiColor[]).map((color) => (
              <button
                key={color}
                onClick={() => onAddWashi(color)}
                className={cn(
                  "w-16 h-6 rounded-sm transition-all hover:scale-105 border border-border/30",
                  color === "pink" && "bg-washi-pink",
                  color === "green" && "bg-washi-green",
                  color === "yellow" && "bg-washi-yellow",
                  color === "blue" && "bg-washi-blue"
                )}
                aria-label={`${color} washi tape`}
                title={`${color} washi tape`}
              />
            ))}
          </div>
        </div>
      )}

      {effectiveOpenPanel === "stickers" && (
        <div className="absolute bottom-full mb-3 bg-card rounded-2xl shadow-xl border border-border p-4 animate-fade-in-up">
          <p className="text-xs text-muted-foreground mb-3 font-serif">Stickers</p>
          <div className="flex gap-2">
            {(["heart", "star", "flower", "butterfly", "sun"] as StickerType[]).map((type) => (
              <button
                key={type}
                onClick={() => onAddSticker(type)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-secondary text-lg"
                aria-label={`${type} sticker`}
                title={type}
              >
                {type === "heart" && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 21 C6 15 1 11 1 7 C1 3 4 1 7 1 C9 1 11 3 12 4 C13 3 15 1 17 1 C20 1 23 3 23 7 C23 11 18 15 12 21Z" fill="#e8a0a0"/></svg>
                )}
                {type === "star" && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2 L14 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L10 9Z" fill="#f0d080"/></svg>
                )}
                {type === "flower" && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><circle cx="12" cy="7" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="17" cy="11" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="15" cy="17" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="9" cy="17" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="7" cy="11" r="4" fill="#f5cdd2" opacity="0.8"/><circle cx="12" cy="12" r="3" fill="#f5e5a8"/></svg>
                )}
                {type === "butterfly" && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><ellipse cx="8" cy="9" rx="6" ry="5" fill="#c2dcc8" opacity="0.8" transform="rotate(-20 8 9)"/><ellipse cx="16" cy="9" rx="6" ry="5" fill="#c2dcc8" opacity="0.8" transform="rotate(20 16 9)"/><line x1="12" y1="6" x2="12" y2="20" stroke="#8a817c" strokeWidth="0.8"/></svg>
                )}
                {type === "sun" && (
                  <svg viewBox="0 0 24 24" className="w-6 h-6"><circle cx="12" cy="12" r="5" fill="#f5e5a8" opacity="0.85"/>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="12" y1="12" x2={12 + 9 * Math.cos((a * Math.PI) / 180)} y2={12 + 9 * Math.sin((a * Math.PI) / 180)} stroke="#e8c060" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>)}</svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
