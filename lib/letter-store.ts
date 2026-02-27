/**
 * Letter state types and in-memory store (for prototype /letter/[id] and sent-confirmation).
 * Supabase is used for persistence when sending via Send modal (/l/[id]).
 */

export type InkColor = "brown" | "navy" | "black"
export type FontStyle = "handwriting" | "serif"

export interface DecoElement {
  id: string
  type: "washi" | "sticker" | "photo"
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
  inkColor: InkColor
  fontStyle: FontStyle
  decorations: DecoElement[]
  additionalPages?: LetterPage[]
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
