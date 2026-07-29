import { formatarDataBR } from "@/lib/utils"
import type { PlanejamentoVisualizacao } from "@/lib/types"

/** Tabela somente leitura, gerada dinamicamente a partir das colunas
 * configuradas pela professora — apenas para conferência e exportação. */
export function TabelaPlanejamento({ visualizacao }: { visualizacao: PlanejamentoVisualizacao }) {
  const colunas = [...visualizacao.colunas].sort((a, b) => a.ordem - b.ordem)

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="p-3 text-left font-medium">Data</th>
            {colunas.map((coluna) => (
              <th key={coluna.id} className="p-3 text-left font-medium">
                {coluna.nome}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visualizacao.linhas.map((linha, indice) => (
            <tr key={linha.data} className={indice % 2 === 0 ? "bg-card" : "bg-muted/40"}>
              <td className="p-3 align-top font-medium whitespace-nowrap">
                {formatarDataBR(linha.data)}
              </td>
              {colunas.map((coluna) => (
                <td key={coluna.id} className="p-3 align-top whitespace-pre-wrap text-foreground">
                  {linha.valores[coluna.id] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
