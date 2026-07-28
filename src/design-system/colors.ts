/**
 * Paleta e cores semânticas do Infans — visual premium (Stripe/Linear/Notion como
 * referência de qualidade, não de cópia): sidebar azul bem claro (para o logo
 * aparecer bem), navbar e cards brancos sobre um fundo cinza-azulado suave.
 *
 * Fonte única de verdade dos valores de cor. As CSS variables em `src/app/globals.css`
 * (consumidas pelo Tailwind/shadcn) espelham exatamente estes valores — ao mudar uma
 * cor aqui, replique o mesmo valor lá. Isso é necessário porque o Tailwind v4 é
 * CSS-first (não lê um `tailwind.config.ts`); este arquivo é a documentação tipada
 * usada pelo código JS/TS (gráficos, ícones, estilos inline) e o ponto de referência
 * para saber o que atualizar em `globals.css`.
 */

export const palette = {
  primary: "#4F9DFF",
  primaryDark: "#2F7FE0",
  secondary: "#64C79B",
  warning: "#F59E0B",
  error: "#EF4444",

  babyBlue: {
    100: "#EAF4FF", // sidebar
    200: "#D6EAFF", // hover
  },

  slate: {
    50: "#F5F7FB", // fundo da página
    100: "#F1F5F9",
    200: "#E2E8F0",
    500: "#64748B", // texto secundário
    800: "#1E293B", // texto principal
  },

  white: "#FFFFFF",

  /** Tons de apoio — usados nos ícones coloridos dos cards do dashboard. */
  support: {
    blue: { bg: "#E8F2FF", fg: "#2F7FE0" },
    green: { bg: "#E6F7EE", fg: "#2F9D6C" },
    purple: { bg: "#F1EDFE", fg: "#8B5CF6" },
    orange: { bg: "#FFF1E0", fg: "#F59E0B" },
    yellow: { bg: "#FFF9E0", fg: "#D4A017" },
  },
} as const

export const colors = {
  background: palette.slate[50],
  foreground: palette.slate[800],

  card: palette.white,
  cardForeground: palette.slate[800],

  popover: palette.white,
  popoverForeground: palette.slate[800],

  navbar: palette.white,

  primary: palette.primary,
  primaryForeground: palette.white,

  secondary: palette.secondary,
  secondaryForeground: palette.white,

  muted: palette.slate[100],
  mutedForeground: palette.slate[500],

  accent: palette.support.blue.bg,
  accentForeground: palette.primaryDark,

  success: palette.support.green.bg,
  successForeground: palette.support.green.fg,

  warning: palette.warning,
  destructive: palette.error,

  border: palette.slate[200],
  input: palette.slate[200],
  ring: palette.primary,

  chart: {
    1: palette.primary,
    2: palette.secondary,
    3: palette.support.purple.fg,
    4: palette.warning,
    5: palette.slate[500],
  },

  support: palette.support,

  sidebar: palette.babyBlue[100],
  sidebarForeground: palette.slate[800],
  sidebarPrimary: palette.primary,
  sidebarPrimaryForeground: palette.white,
  sidebarAccent: palette.babyBlue[200],
  sidebarAccentForeground: palette.slate[800],
  sidebarActive: palette.white,
  sidebarActiveForeground: palette.primaryDark,
  sidebarBorder: palette.babyBlue[200],
  sidebarRing: palette.primary,
} as const

export type Palette = typeof palette
export type Colors = typeof colors
export type ColorToken = keyof Colors
