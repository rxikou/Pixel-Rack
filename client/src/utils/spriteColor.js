// Placeholder sprite colors, used until the Gemini + sharp pipeline produces
// a real pixel sprite for a car. Derived from the id so a given car always
// renders the same color instead of flickering between renders.
const PALETTE = [
  '#f97316',
  '#38bdf8',
  '#f472b6',
  '#4ade80',
  '#facc15',
  '#a78bfa',
  '#ef4444',
  '#22c55e',
]

export function spriteColorFor(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}
