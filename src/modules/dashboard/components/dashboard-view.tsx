"use client"

import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, Baby, FileText, NotebookPen } from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarDataBR } from "@/lib/utils"
import { listarEscolas } from "@/modules/escolas/api"

import { obterDashboard } from "../api"
import { MetricCard } from "./metric-card"

const TODAS_AS_ESCOLAS = "todas"

export function DashboardView() {
  const [escolaSelecionada, setEscolaSelecionada] = useState(TODAS_AS_ESCOLAS)
  const escolaIdFiltro = escolaSelecionada === TODAS_AS_ESCOLAS ? undefined : escolaSelecionada

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", escolaIdFiltro],
    queryFn: () => obterDashboard(escolaIdFiltro),
  })

  return (
    <div className="space-y-6">
      {escolas && escolas.length > 0 && (
        <div className="max-w-xs space-y-1.5">
          <Label>Escola</Label>
          <Select value={escolaSelecionada} onValueChange={(valor) => setEscolaSelecionada(valor ?? TODAS_AS_ESCOLAS)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {() =>
                  escolaSelecionada === TODAS_AS_ESCOLAS
                    ? "Todas as escolas"
                    : escolas.find((escola) => escola.id === escolaSelecionada)?.nome
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_AS_ESCOLAS}>Todas as escolas</SelectItem>
              {escolas.map((escola) => (
                <SelectItem key={escola.id} value={escola.id}>
                  {escola.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading || !dashboard ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard icon={Baby} label="Crianças" value={dashboard.quantidade_criancas} />
            <MetricCard icon={NotebookPen} label="Registros" value={dashboard.quantidade_registros} />
            <MetricCard icon={FileText} label="Relatórios" value={dashboard.quantidade_relatorios} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Últimos registros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard.ultimos_registros.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
                ) : (
                  dashboard.ultimos_registros.map((registro, index) => (
                    <div key={index} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        {registro.crianca_nome} · {formatarDataBR(registro.data)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground">{registro.texto}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Crianças sem registro recente
                </CardTitle>
                <CardDescription>Com base no alerta configurado em Configurações.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboard.criancas_sem_registro_recente.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Todas as crianças estão em dia.</p>
                ) : (
                  dashboard.criancas_sem_registro_recente.map((alerta) => (
                    <div
                      key={alerta.crianca_id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <span className="text-sm font-medium text-foreground">{alerta.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {alerta.dias_sem_registro === null
                          ? "Nunca registrado"
                          : `${alerta.dias_sem_registro} dias sem registro`}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {dashboard.ultimo_login && (
            <p className="text-xs text-muted-foreground">
              Último acesso: {new Date(dashboard.ultimo_login).toLocaleString("pt-BR")}
            </p>
          )}
        </>
      )}
    </div>
  )
}
