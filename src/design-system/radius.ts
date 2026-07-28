/** Raio de borda — base 0.75rem (mesma base usada em `globals.css` via `--radius`). */

const BASE = 0.75

export const radius = {
  sm: `${BASE * 0.6}rem`,
  md: `${BASE * 0.8}rem`,
  lg: `${BASE}rem`,
  xl: `${BASE * 1.4}rem`,
  "2xl": `${BASE * 1.8}rem`,
  full: "9999px",
} as const

export type Radius = typeof radius
