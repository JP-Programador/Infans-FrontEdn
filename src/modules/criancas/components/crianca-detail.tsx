"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTitle } from "@/components/ui/page-title"
import { Textarea } from "@/components/ui/textarea"
import { formatarDataBR } from "@/lib/utils"
import { Historico } from "@/modules/registros/components/historico"
import { RegistroForm } from "@/modules/registros/components/registro-form"
import { ConsolidarModal } from "@/modules/relatorios/components/consolidar-modal"

import { obterCrianca } from "../api"

type Rascunho = { texto: string; data_inicio: string; data_fim: string }

export function CriancaDetail({ criancaId }: { criancaId: string }) {
  const [rascunho, setRascunho] = useState<Rascunho | null>(null)

  const { data: crianca, isLoading } = useQuery({
    queryKey: ["crianca", criancaId],
    queryFn: () => obterCrianca(criancaId),
  })

  if (isLoading || !crianca) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  const idade = `${crianca.idade_anos} ${crianca.idade_anos === 1 ? "ano" : "anos"} e ${crianca.idade_meses} ${
    crianca.idade_meses === 1 ? "mês" : "meses"
  }`

  return (
    <div className="space-y-6">
      <PageTitle
        title={crianca.nome}
        description={idade + (crianca.responsavel ? ` · Responsável: ${crianca.responsavel}` : "")}
        action={
          <div className="flex flex-wrap gap-2">
            <ConsolidarModal
              modo="literal"
              criancaId={criancaId}
              criancaNome={crianca.nome}
              turmaId={crianca.turma_id}
              onUsarComoRascunho={(texto, periodo) => setRascunho({ texto, ...periodo })}
            />
            <ConsolidarModal
              modo="evolutivo"
              criancaId={criancaId}
              criancaNome={crianca.nome}
              turmaId={crianca.turma_id}
              onUsarComoRascunho={(texto, periodo) => setRascunho({ texto, ...periodo })}
            />
          </div>
        }
      />
      {rascunho && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Rascunho — {formatarDataBR(rascunho.data_inicio)} até {formatarDataBR(rascunho.data_fim)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={10}
              value={rascunho.texto}
              onChange={(event) => setRascunho({ ...rascunho, texto: event.target.value })}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Este texto ainda não foi salvo como relatório oficial. Ajuste-o livremente aqui.
            </p>
          </CardContent>
        </Card>
      )}
      <RegistroForm criancaId={criancaId} />
      <Historico criancaId={criancaId} />
    </div>
  )
}
