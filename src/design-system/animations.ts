/** Durações, easings e classes de transição (usam `tw-animate-css`, já instalado). */

export const duration = {
  fast: "100ms",
  normal: "150ms",
  slow: "250ms",
} as const

export const easing = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const

/** Classes utilitárias reaproveitadas nos componentes com estado aberto/fechado
 * (Dialog, Select, Modal) — mesmo padrão usado pelos componentes shadcn/Base UI. */
export const transitions = {
  fade: "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  scale: "data-open:zoom-in-95 data-closed:zoom-out-95",
  slideFromTop: "data-open:slide-in-from-top-2",
} as const

export const animations = { duration, easing, transitions } as const
export type Animations = typeof animations
