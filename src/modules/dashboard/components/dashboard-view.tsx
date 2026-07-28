"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PageTitle } from "@/components/ui/page-title"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/ui/stat-card"
import { AlertIcon, ChildIcon, RecordIcon, ReportIcon } from "@/design-system/icons"
import { formatarDataBR } from "@/lib/utils"
import { listarEscolas } from "@/modules/escolas/api"
import { useAuth } from "@/providers/auth-provider"

import { obterDashboard } from "../api"
import { CriancaRapidaModal } from "./crianca-rapida-modal"
import { RegistroRapidoModal } from "./registro-rapido-modal"
import { RegistrosChart } from "./registros-chart"
import { TurmasResumo } from "./turmas-resumo"

const TODAS_AS_ESCOLAS = "todas"

function primeiroNome(nomeCompleto: string): string {
  return nomeCompleto.trim().split(/\s+/)[0]
}

export function DashboardView() {
  const { professora } = useAuth()
  const [escolaSelecionada, setEscolaSelecionada] = useState(TODAS_AS_ESCOLAS)
  const escolaIdFiltro = escolaSelecionada === TODAS_AS_ESCOLAS ? undefined : escolaSelecionada

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", escolaIdFiltro],
    queryFn: () => obterDashboard(escolaIdFiltro),
  })

  return (
    <div className="space-y-6">
      <PageTitle
        title={professora ? `Olá, ${primeiroNome(professora.nome)}! 👋` : "Dashboard"}
        description="Vamos continuar acompanhando cada conquista."
        action={
          <div className="flex flex-wrap gap-2">
            <RegistroRapidoModal />
            <CriancaRapidaModal />
          </div>
        }
      />

      {escolas && escolas.length > 0 && (
        <div className="max-w-xs space-y-1.5">
          <Label>Escola</Label>
          <Select
            value={escolaSelecionada}
            onValueChange={(valor) => setEscolaSelecionada(valor ?? TODAS_AS_ESCOLAS)}
          >
            <SelectTrigger className="w-full bg-card">
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
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={ChildIcon} label="Crianças" value={dashboard.quantidade_criancas} tone="blue" />
            <StatCard icon={RecordIcon} label="Registros" value={dashboard.quantidade_registros} tone="green" />
            <StatCard icon={ReportIcon} label="Relatórios" value={dashboard.quantidade_relatorios} tone="purple" />
          </div>

          <RegistrosChart dados={dashboard.registros_por_semana} />

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Atividades recentes</CardTitle>
                <CardDescription>Últimos registros pedagógicos salvos.</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.ultimos_registros.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
                ) : (
                  <ol className="relative space-y-5 border-l border-border pl-5">
                    {dashboard.ultimos_registros.map((registro, index) => (
                      <li key={index} className="relative">
                        <span className="absolute top-1 -left-[1.72rem] size-3 rounded-full border-2 border-card bg-support-blue" />
                        <p className="text-xs font-medium text-muted-foreground">
                          {registro.crianca_nome} · {formatarDataBR(registro.data)}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-foreground">{registro.texto}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>

            <TurmasResumo turmas={dashboard.turmas} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertIcon className="size-4 text-warning" />
                Crianças sem registro recente
              </CardTitle>
              <CardDescription>Com base no alerta configurado em Configurações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboard.criancas_sem_registro_recente.length === 0 ? (
                <p className="text-sm text-muted-foreground">Todas as crianças estão em dia.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {dashboard.criancas_sem_registro_recente.map((alerta) => (
                    <div
                      key={alerta.crianca_id}
                      className="flex items-center justify-between rounded-xl bg-support-orange-soft px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">{alerta.nome}</span>
                      <span className="text-xs font-medium text-support-orange">
                        {alerta.dias_sem_registro === null
                          ? "Nunca registrado"
                          : `${alerta.dias_sem_registro} dias sem registro`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
