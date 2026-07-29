import { formatarDataBR } from "@/lib/utils"
import type { PlanejamentoVisualizacao } from "@/lib/types"

const COLUNAS: { chave: keyof PlanejamentoVisualizacao["linhas"][number]; titulo: string }[] = [
  { chave: "objetivo_aprendizagem", titulo: "Objetivo de aprendizagem" },
  { chave: "expectativa_criancas", titulo: "Espera-se que as crianças possam" },
  { chave: "atividades_estrategias", titulo: "Atividades / Estratégias / Interações" },
  { chave: "materiais", titulo: "Materiais" },
  { chave: "organizacao_tempo_espaco", titulo: "Organização / Tempo / Espaço" },
]

/** Tabela somente leitura, no padrão pedagógico usado pelas professoras — apenas
 * para conferência e exportação, não é editável aqui. */
export function TabelaPlanejamento({ visualizacao }: { visualizacao: PlanejamentoVisualizacao }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="p-3 text-left font-medium">Data</th>
            {COLUNAS.map((coluna) => (
              <th key={coluna.chave} className="p-3 text-left font-medium">
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visualizacao.linhas.map((linha, indice) => (
            <tr
              key={linha.data}
              className={indice % 2 === 0 ? "bg-card" : "bg-muted/40"}
            >
              <td className="p-3 align-top font-medium whitespace-nowrap">
                {formatarDataBR(linha.data)}
              </td>
              {COLUNAS.map((coluna) => (
                <td key={coluna.chave} className="p-3 align-top whitespace-pre-wrap text-foreground">
                  {linha[coluna.chave] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
