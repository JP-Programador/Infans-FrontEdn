"use client"

import { useQuery } from "@tanstack/react-query"
import { Users } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { listarTurmas } from "../api"

export function TurmasList({ escolaId }: { escolaId: string }) {
  const { data: turmas, isLoading } = useQuery({
    queryKey: ["turmas", escolaId],
    queryFn: () => listarTurmas(escolaId),
  })

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!turmas || turmas.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhuma turma cadastrada"
        description="Crie uma turma para começar a cadastrar as crianças."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {turmas.map((turma) => (
        <Link key={turma.id} href={`/escolas/${escolaId}/turmas/${turma.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                {turma.nome}
                {!turma.ativa && <Badge variant="secondary">Inativa</Badge>}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
