/** Escala tipográfica do Infans. */

export const fontFamily = {
  sans: "var(--font-sans)",
  mono: "var(--font-geist-mono)",
} as const

export const fontSize = {
  xs: "0.75rem",
  sm: "0.8125rem",
  base: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
} as const

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const

export const lineHeight = {
  tight: "1.2",
  normal: "1.5",
  relaxed: "1.75",
} as const

export const typography = { fontFamily, fontSize, fontWeight, lineHeight } as const
export type Typography = typeof typography
