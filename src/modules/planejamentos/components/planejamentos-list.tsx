"use client"

import { useQuery } from "@tanstack/react-query"

import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PlanningIcon } from "@/design-system/icons"

import { listarPlanejamentos } from "../api"
import { PlanejamentoCard } from "./planejamento-card"

export function PlanejamentosList() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["planejamentos"],
    queryFn: () => listarPlanejamentos(),
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={PlanningIcon}
        title="Nenhum planejamento criado"
        description="Crie o primeiro cronograma semanal para começar a preencher dia a dia."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((planejamento) => (
        <PlanejamentoCard
          key={planejamento.id}
          planejamento={planejamento}
          onMudou={() => refetch()}
        />
      ))}
    </div>
  )
}
