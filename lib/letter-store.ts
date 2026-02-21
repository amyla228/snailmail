/**
 * Mock letter store for prototype — in-memory persistence.
 * In production this would be an API + database.
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

export interface SavedLetterState {
  text: string
  date: string
  greeting: string
  signature: string
  inkColor: InkColor
  fontStyle: FontStyle
  decorations: DecoElement[]
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
