"use client"

import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { PageTitle } from "@/components/ui/page-title"
import { TurmaFormDialog } from "@/modules/turmas/components/turma-form-dialog"
import { TurmasList } from "@/modules/turmas/components/turmas-list"

import { obterEscola } from "../api"
import { EscolaEditDialog } from "./escola-edit-dialog"
import { ProfessorasDaEscola } from "./professoras-da-escola"

export function EscolaDetail({ escolaId }: { escolaId: string }) {
  const { data: escola, isLoading } = useQuery({
    queryKey: ["escolas", escolaId],
    queryFn: () => obterEscola(escolaId),
  })

  if (isLoading || !escola) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={escola.nome}
        description={[escola.cidade, escola.estado].filter(Boolean).join(" - ") || undefined}
        action={
          <div className="flex gap-2">
            <EscolaEditDialog escola={escola} />
            <TurmaFormDialog escolaId={escolaId} />
          </div>
        }
      />
      {!escola.ativa && <Badge variant="secondary">Escola inativa</Badge>}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TurmasList escolaId={escolaId} />
        </div>
        <ProfessorasDaEscola escolaId={escolaId} />
      </div>
    </div>
  )
}
