"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from "@/design-system/icons"
import { formatarDataBR } from "@/lib/utils"

import { atualizarDia, listarDias, obterPlanejamento } from "../api"
import { AutosaveIndicator } from "./autosave-indicator"
import { EditarColunasDialog } from "./editar-colunas-dialog"
import { ProgressoPlanejamento } from "./progresso-planejamento"
import { useAutosave } from "../use-autosave"

function formatarDiaDaSemana(dataIso: string): string {
  const data = new Date(`${dataIso}T00:00:00`)
  const texto = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function DiaPlanejamentoForm({ planejamentoId }: { planejamentoId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [indice, setIndice] = useState(0)
  const [campos, setCampos] = useState<Record<string, string> | null>(null)

  const { data: planejamento } = useQuery({
    queryKey: ["planejamento", planejamentoId],
    queryFn: () => obterPlanejamento(planejamentoId),
  })
  const { data: dias, isLoading } = useQuery({
    queryKey: ["planejamento-dias", planejamentoId],
    queryFn: () => listarDias(planejamentoId),
  })

  const colunas = planejamento ? [...planejamento.colunas].sort((a, b) => a.ordem - b.ordem) : []
  const diaAtual = dias?.[indice]

  useEffect(() => {
    if (diaAtual) setCampos({ ...diaAtual.celulas })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaAtual?.id])

  const { status, salvarAgora } = useAutosave(
    campos,
    async (valores) => {
      if (!diaAtual || !valores) return
      await atualizarDia(planejamentoId, diaAtual.id, valores)
      queryClient.invalidateQueries({ queryKey: ["planejamento-dias", planejamentoId] })
      queryClient.invalidateQueries({ queryKey: ["planejamento", planejamentoId] })
    },
    { chave: diaAtual?.id }
  )

  function invalidarColunas() {
    queryClient.invalidateQueries({ queryKey: ["planejamento", planejamentoId] })
    queryClient.invalidateQueries({ queryKey: ["planejamento-dias", planejamentoId] })
  }

  if (isLoading || !dias || !planejamento || !campos || !diaAtual) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  async function irPara(novoIndice: number) {
    await salvarAgora()
    setIndice(novoIndice)
  }

  function atualizarCampo(colunaId: string, valor: string) {
    setCampos((atual) => (atual ? { ...atual, [colunaId]: valor } : atual))
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-heading text-base font-medium text-foreground">
              {formatarDiaDaSemana(diaAtual.data)}
            </p>
            <p className="text-sm text-muted-foreground">{formatarDataBR(diaAtual.data)}</p>
          </div>
          <div className="flex items-center gap-3">
            <AutosaveIndicator status={status} />
            <EditarColunasDialog
              planejamentoId={planejamentoId}
              colunas={colunas}
              onMudou={invalidarColunas}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <SettingsIcon className="size-4" />
                  Colunas
                </Button>
              }
            />
          </div>
        </div>
        <ProgressoPlanejamento atual={indice + 1} total={dias.length} />
      </CardHeader>
      <CardContent className="space-y-4">
        {colunas.map((coluna) => (
          <div key={coluna.id} className="space-y-1.5">
            <Label>{coluna.nome}</Label>
            <Textarea
              rows={4}
              value={campos[coluna.id] ?? ""}
              onChange={(e) => atualizarCampo(coluna.id, e.target.value)}
              placeholder={`Escreva sobre "${coluna.nome}" para este dia...`}
            />
          </div>
        ))}

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
          {indice < dias.length - 1 ? (
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
