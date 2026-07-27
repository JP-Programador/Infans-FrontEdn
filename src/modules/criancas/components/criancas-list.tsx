"use client"

import { useQuery } from "@tanstack/react-query"
import { Baby } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { listarCriancas } from "../api"

export function CriancasList({ turmaId }: { turmaId: string }) {
  const { data: criancas, isLoading } = useQuery({
    queryKey: ["criancas", turmaId],
    queryFn: () => listarCriancas(turmaId),
  })

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!criancas || criancas.length === 0) {
    return (
      <EmptyState
        icon={Baby}
        title="Nenhuma criança cadastrada"
        description="Cadastre as crianças desta turma para começar os registros pedagógicos."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {criancas.map((crianca) => (
        <Link key={crianca.id} href={`/criancas/${crianca.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{crianca.nome}</CardTitle>
              <CardDescription>
                {crianca.idade_anos} {crianca.idade_anos === 1 ? "ano" : "anos"} e {crianca.idade_meses}{" "}
                {crianca.idade_meses === 1 ? "mês" : "meses"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
