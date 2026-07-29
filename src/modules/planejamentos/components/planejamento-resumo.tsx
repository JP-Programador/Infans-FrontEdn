"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import { ViewIcon } from "@/design-system/icons"
import { formatarDataBR } from "@/lib/utils"

import { obterPlanejamento } from "../api"
import { ExportButtons } from "./export-buttons"

function EstatCard({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <p className="text-2xl font-semibold text-foreground">{valor}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function PlanejamentoResumo({ planejamentoId }: { planejamentoId: string }) {
  const { data: planejamento, isLoading } = useQuery({
    queryKey: ["planejamento", planejamentoId],
    queryFn: () => obterPlanejamento(planejamentoId),
  })

  if (isLoading || !planejamento) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div>
      <PageTitle
        title={planejamento.titulo}
        description={
          `${planejamento.turma_nome} · ${planejamento.escola_nome} · ` +
          `${formatarDataBR(planejamento.data_inicio)} até ${formatarDataBR(planejamento.data_fim)}`
        }
        action={
          <Badge variant={planejamento.status === "concluido" ? "default" : "secondary"}>
            {planejamento.status === "concluido" ? "Concluído" : "Rascunho"}
          </Badge>
        }
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <EstatCard
              label="Dias preenchidos"
              valor={`${planejamento.quantidade_dias_preenchidos}/${planejamento.quantidade_dias}`}
            />
            <EstatCard label="Objetivos definidos" valor={planejamento.quantidade_objetivos} />
            <EstatCard label="Materiais citados" valor={planejamento.materiais_citados.length} />
            <EstatCard
              label="Status"
              valor={planejamento.status === "concluido" ? "Concluído" : "Rascunho"}
            />
          </div>

          {planejamento.materiais_citados.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Materiais citados</p>
              <div className="flex flex-wrap gap-1.5">
                {planejamento.materiais_citados.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Link href={`/planejamentos/${planejamentoId}/visualizar`}>
              <Button variant="outline" className="gap-2">
                <ViewIcon className="size-4" />
                Visualizar tabela
              </Button>
            </Link>
            <ExportButtons planejamentoId={planejamentoId} />
            <Link href={`/planejamentos/${planejamentoId}/editar`} className="ml-auto">
              <Button variant="ghost">Continuar preenchendo</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
