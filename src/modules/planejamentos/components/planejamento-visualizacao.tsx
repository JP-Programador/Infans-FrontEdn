"use client"

import { useQuery } from "@tanstack/react-query"

import { PageTitle } from "@/components/ui/page-title"
import { formatarDataBR } from "@/lib/utils"

import { obterVisualizacaoPlanejamento } from "../api"
import { ExportButtons } from "./export-buttons"
import { TabelaPlanejamento } from "./tabela-planejamento"

export function PlanejamentoVisualizacao({ planejamentoId }: { planejamentoId: string }) {
  const { data: visualizacao, isLoading } = useQuery({
    queryKey: ["planejamento-visualizacao", planejamentoId],
    queryFn: () => obterVisualizacaoPlanejamento(planejamentoId),
  })

  if (isLoading || !visualizacao) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div>
      <PageTitle
        title={visualizacao.titulo}
        description={
          `${visualizacao.rotulo_turma === "agrupamento" ? "Agrupamento" : "Turma"}: ` +
          `${visualizacao.turma_nome} · ` +
          `${formatarDataBR(visualizacao.data_inicio)} até ${formatarDataBR(visualizacao.data_fim)}`
        }
        action={<ExportButtons planejamentoId={planejamentoId} />}
      />
      <p className="mb-4 text-xs text-muted-foreground">
        Esta tabela é apenas para conferência e exportação — para editar, volte à tela de
        preenchimento.
      </p>
      <TabelaPlanejamento visualizacao={visualizacao} />
    </div>
  )
}
