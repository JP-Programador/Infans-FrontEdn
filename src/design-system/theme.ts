import { animations } from "./animations"
import { colors } from "./colors"
import { radius } from "./radius"
import { shadows } from "./shadows"
import { spacing } from "./spacing"
import { typography } from "./typography"

/**
 * Objeto agregador do design system do Infans. Qualquer código (componente,
 * gráfico, animação controlada por JS) que precise de um token de forma
 * tipada deve importar `theme` a partir daqui em vez de valores soltos.
 *
 * Os componentes visuais (`components/ui`) continuam estilizados via classes
 * Tailwind + CSS variables em `src/app/globals.css` — este arquivo é a fonte
 * de documentação/tipagem dos mesmos valores, não um mecanismo de geração de
 * CSS. Ao alterar uma cor/raio/etc. aqui, replique o valor em `globals.css`.
 */
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  radius,
  ...animations,
} as const

export type Theme = typeof theme
