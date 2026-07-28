"use client"

import { useQuery } from "@tanstack/react-query"
import { EmptySearchIcon } from "@/design-system/icons"
import { useState } from "react"

import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarDataBR } from "@/lib/utils"

import { listarHistorico } from "../api"

export function Historico({ criancaId }: { criancaId: string }) {
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [palavra, setPalavra] = useState("")

  const { data: registros, isLoading } = useQuery({
    queryKey: ["registros", criancaId, { dataInicio, dataFim, palavra }],
    queryFn: () =>
      listarHistorico(criancaId, {
        data_inicio: dataInicio || undefined,
        data_fim: dataFim || undefined,
        palavra: palavra || undefined,
      }),
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="data_inicio">De</Label>
            <Input
              id="data_inicio"
              type="date"
              value={dataInicio}
              onChange={(event) => setDataInicio(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="data_fim">Até</Label>
            <Input
              id="data_fim"
              type="date"
              value={dataFim}
              onChange={(event) => setDataFim(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="palavra">Palavra-chave</Label>
            <Input
              id="palavra"
              placeholder="Buscar no texto..."
              value={palavra}
              onChange={(event) => setPalavra(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !registros || registros.length === 0 ? (
        <EmptyState
          icon={EmptySearchIcon}
          title="Nenhum registro encontrado"
          description="Ajuste os filtros ou adicione um novo registro acima."
        />
      ) : (
        <div className="space-y-3">
          {registros.map((registro) => (
            <Card key={registro.id}>
              <CardHeader className="pb-2">
                <p className="text-sm font-medium text-muted-foreground">{formatarDataBR(registro.data)}</p>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-foreground">{registro.texto}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
