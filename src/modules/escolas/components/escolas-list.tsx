"use client"

import { useQuery } from "@tanstack/react-query"
import { SchoolIcon } from "@/design-system/icons"
import Link from "next/link"

import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { listarEscolas } from "../api"

export function EscolasList() {
  const { data: escolas, isLoading } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!escolas || escolas.length === 0) {
    return (
      <EmptyState
        icon={SchoolIcon}
        title="Nenhuma escola cadastrada"
        description="Crie sua primeira escola para começar a organizar turmas e crianças."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {escolas.map((escola) => (
        <Link key={escola.id} href={`/escolas/${escola.id}`}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                {escola.nome}
                {!escola.ativa && <Badge variant="secondary">Inativa</Badge>}
              </CardTitle>
              {(escola.cidade || escola.estado) && (
                <CardDescription>
                  {[escola.cidade, escola.estado].filter(Boolean).join(" - ")}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
