"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeftIcon, ChevronRightIcon } from "@/design-system/icons"
import { formatarDataBR } from "@/lib/utils"
import type { PlanejamentoItem } from "@/lib/types"

import { atualizarItemPlanejamento, listarItensPlanejamento } from "../api"
import { AutosaveIndicator } from "./autosave-indicator"
import { ProgressoPlanejamento } from "./progresso-planejamento"
import { useAutosave } from "../use-autosave"

type CamposEditaveis = Pick<
  PlanejamentoItem,
  | "objetivo_aprendizagem"
  | "atividade_titulo"
  | "atividade_descricao"
  | "materiais"
  | "organizacao_tempo_espaco"
>

function camposDoItem(item: PlanejamentoItem): CamposEditaveis {
  return {
    objetivo_aprendizagem: item.objetivo_aprendizagem,
    atividade_titulo: item.atividade_titulo,
    atividade_descricao: item.atividade_descricao,
    materiais: item.materiais,
    organizacao_tempo_espaco: item.organizacao_tempo_espaco,
  }
}

function formatarDiaDaSemana(dataIso: string): string {
  const data = new Date(`${dataIso}T00:00:00`)
  const texto = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function DiaPlanejamentoForm({ planejamentoId }: { planejamentoId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [indice, setIndice] = useState(0)
  const [campos, setCampos] = useState<CamposEditaveis | null>(null)

  const { data: itens, isLoading } = useQuery({
    queryKey: ["planejamento-itens", planejamentoId],
    queryFn: () => listarItensPlanejamento(planejamentoId),
  })

  const itemAtual = itens?.[indice]

  useEffect(() => {
    if (itemAtual) setCampos(camposDoItem(itemAtual))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemAtual?.id])

  const { status, salvarAgora } = useAutosave(
    campos,
    async (valores) => {
      if (!itemAtual || !valores) return
      await atualizarItemPlanejamento(planejamentoId, itemAtual.id, valores)
      queryClient.invalidateQueries({ queryKey: ["planejamento-itens", planejamentoId] })
      queryClient.invalidateQueries({ queryKey: ["planejamento", planejamentoId] })
    },
    { chave: itemAtual?.id }
  )

  if (isLoading || !itens || !campos || !itemAtual) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  async function irPara(novoIndice: number) {
    await salvarAgora()
    setIndice(novoIndice)
  }

  function atualizarCampo(campo: keyof CamposEditaveis, valor: string) {
    setCampos((atual) => (atual ? { ...atual, [campo]: valor } : atual))
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-heading text-base font-medium text-foreground">
              {formatarDiaDaSemana(itemAtual.data)}
            </p>
            <p className="text-sm text-muted-foreground">{formatarDataBR(itemAtual.data)}</p>
          </div>
          <AutosaveIndicator status={status} />
        </div>
        <ProgressoPlanejamento atual={indice + 1} total={itens.length} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Objetivo de aprendizagem / Espera-se que as crianças possam</Label>
          <Textarea
            rows={4}
            value={campos.objetivo_aprendizagem}
            onChange={(e) => atualizarCampo("objetivo_aprendizagem", e.target.value)}
            placeholder="O que você pretende trabalhar hoje e o que se espera que as crianças consigam fazer..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Atividades / Estratégias / Interações</Label>
          <Input
            value={campos.atividade_titulo}
            onChange={(e) => atualizarCampo("atividade_titulo", e.target.value)}
            placeholder="Título da atividade (ex.: TEATRO COM FANTOCHE)"
            className="font-semibold"
          />
          <Textarea
            rows={5}
            value={campos.atividade_descricao}
            onChange={(e) => atualizarCampo("atividade_descricao", e.target.value)}
            placeholder="Descreva como a atividade será conduzida..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Materiais</Label>
          <Textarea
            rows={2}
            value={campos.materiais}
            onChange={(e) => atualizarCampo("materiais", e.target.value)}
            placeholder="Materiais necessários..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Organização / Tempo / Espaço</Label>
          <Textarea
            rows={2}
            value={campos.organizacao_tempo_espaco}
            onChange={(e) => atualizarCampo("organizacao_tempo_espaco", e.target.value)}
            placeholder="Onde e quando a atividade acontecerá..."
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="gap-2"
            disabled={indice === 0}
            onClick={() => irPara(indice - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            Dia anterior
          </Button>
          <Button variant="outline" onClick={salvarAgora}>
            Salvar rascunho
          </Button>
          {indice < itens.length - 1 ? (
            <Button className="gap-2" onClick={() => irPara(indice + 1)}>
              Próximo dia
              <ChevronRightIcon className="size-4" />
            </Button>
          ) : (
            <Button
              className="gap-2"
              onClick={async () => {
                await salvarAgora()
                router.push(`/planejamentos/${planejamentoId}`)
              }}
            >
              Concluir e ver resumo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
