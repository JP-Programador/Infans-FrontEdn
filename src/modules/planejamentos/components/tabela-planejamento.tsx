import { formatarDataBR } from "@/lib/utils"
import type { PlanejamentoVisualizacao } from "@/lib/types"

/** Tabela somente leitura, no padrão pedagógico usado pelas professoras — apenas
 * para conferência e exportação, não é editável aqui. */
export function TabelaPlanejamento({ visualizacao }: { visualizacao: PlanejamentoVisualizacao }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="p-3 text-left font-medium">Data</th>
            <th className="p-3 text-left font-medium">
              Objetivo de aprendizagem / Espera-se que as crianças possam
            </th>
            <th className="p-3 text-left font-medium">Atividades / Estratégias / Interações</th>
            <th className="p-3 text-left font-medium">Materiais</th>
            <th className="p-3 text-left font-medium">Organização / Tempo / Espaço</th>
          </tr>
        </thead>
        <tbody>
          {visualizacao.linhas.map((linha, indice) => (
            <tr key={linha.data} className={indice % 2 === 0 ? "bg-card" : "bg-muted/40"}>
              <td className="p-3 align-top font-medium whitespace-nowrap">
                {formatarDataBR(linha.data)}
              </td>
              <td className="p-3 align-top whitespace-pre-wrap text-foreground">
                {linha.objetivo_aprendizagem || "—"}
              </td>
              <td className="p-3 align-top whitespace-pre-wrap text-foreground">
                {!linha.atividade_titulo && !linha.atividade_descricao ? (
                  "—"
                ) : (
                  <>
                    {linha.atividade_titulo && <p className="font-semibold">{linha.atividade_titulo}</p>}
                    {linha.atividade_descricao && <p>{linha.atividade_descricao}</p>}
                  </>
                )}
              </td>
              <td className="p-3 align-top whitespace-pre-wrap text-foreground">
                {linha.materiais || "—"}
              </td>
              <td className="p-3 align-top whitespace-pre-wrap text-foreground">
                {linha.organizacao_tempo_espaco || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
