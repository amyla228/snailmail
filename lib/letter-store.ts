/**
 * Letter state types and in-memory store (for prototype /letter/[id] and sent-confirmation).
 * Supabase is used for persistence when sending via Send modal (/l/[id]).
 */

export type InkColor = "brown" | "navy" | "black"
export type FontStyle = "handwriting" | "serif"

/** Stroke for doodle layer: array of points in container coordinates */
export interface DoodleStroke {
  points: { x: number; y: number }[]
  color?: string
  width?: number
}

export interface DecoElement {
  id: string
  type: "washi" | "sticker" | "photo" | "waxSeal"
  data: Record<string, string>
  x: number
  y: number
  rotation?: number
}

export interface LetterPage {
  id: string
  text: string
}

export interface SavedLetterState {
  text: string
  date: string
  greeting: string
  signature: string
  /** Recipient name for envelope "To:" (from headline) */
  recipientName?: string
  inkColor: InkColor
  fontStyle: FontStyle
  decorations: DecoElement[]
  additionalPages?: LetterPage[]
  /** Freehand doodles on the letter (serialized strokes) */
  letterDoodles?: DoodleStroke[]
  /** Envelope front color (hex) */
  envelopeColor?: string
  /** Decorations on envelope (stickers, washi, wax seal) */
  envelopeDecorations?: DecoElement[]
  /** Freehand doodles on envelope */
  envelopeDoodles?: DoodleStroke[]
}

const store = new Map<string, SavedLetterState>()

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function saveLetter(state: SavedLetterState): string {
  const id = generateId()
  store.set(id, state)
  return id
}

export function getLetter(id: string): SavedLetterState | undefined {
  return store.get(id)
}
