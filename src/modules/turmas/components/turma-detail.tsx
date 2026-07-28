"use client"

import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { PageTitle } from "@/components/ui/page-title"
import { CriancaFormDialog } from "@/modules/criancas/components/crianca-form-dialog"
import { CriancasList } from "@/modules/criancas/components/criancas-list"

import { obterTurma } from "../api"
import { TurmaEditDialog } from "./turma-edit-dialog"

export function TurmaDetail({ turmaId }: { turmaId: string }) {
  const { data: turma, isLoading } = useQuery({
    queryKey: ["turma", turmaId],
    queryFn: () => obterTurma(turmaId),
  })

  if (isLoading || !turma) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={turma.nome}
        action={
          <div className="flex gap-2">
            <TurmaEditDialog turma={turma} />
            <CriancaFormDialog turmaId={turmaId} />
          </div>
        }
      />
      {!turma.ativa && <Badge variant="secondary">Turma inativa</Badge>}
      <CriancasList turmaId={turmaId} />
    </div>
  )
}
