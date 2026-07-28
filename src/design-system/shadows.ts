/** Sombras padronizadas — estilo suave, sem sombras pesadas (Notion/Linear). */

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
  focusRing: "0 0 0 3px rgb(56 189 248 / 0.5)",
} as const

export type Shadows = typeof shadows
