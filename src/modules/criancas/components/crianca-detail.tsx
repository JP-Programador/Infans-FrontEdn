"use client"

import { useQuery } from "@tanstack/react-query"

import { PageTitle } from "@/components/ui/page-title"
import { Historico } from "@/modules/registros/components/historico"
import { RegistroForm } from "@/modules/registros/components/registro-form"

import { obterCrianca } from "../api"

export function CriancaDetail({ criancaId }: { criancaId: string }) {
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
      />
      <RegistroForm criancaId={criancaId} />
      <Historico criancaId={criancaId} />
    </div>
  )
}
