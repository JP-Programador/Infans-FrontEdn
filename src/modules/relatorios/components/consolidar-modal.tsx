"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CopyIcon, DownloadIcon, SparklesIcon, TrendingUpIcon } from "@/design-system/icons"
import { useAuth } from "@/providers/auth-provider"
import { ApiError } from "@/lib/api-client"
import { obterTurma } from "@/modules/turmas/api"

import { consolidarRelatorio, type ModoConsolidacao, type StatusEvolutivo } from "../api"
import { exportarRelatorioPdf } from "../pdf"
import { consolidarPeriodoSchema, type ConsolidarPeriodoFormValues } from "../schemas"

const STATUS_BADGE: Record<StatusEvolutivo, { label: string; className: string }> = {
  progressao: { label: "Progressão observada", className: "bg-support-green-soft text-support-green" },
  manutencao: { label: "Manutenção observada", className: "bg-support-yellow-soft text-support-yellow" },
  insuficiente: { label: "Evidências insuficientes", className: "bg-support-blue-soft text-support-blue" },
}

const MODO_CONFIG: Record<
  ModoConsolidacao,
  { titulo: string; botao: string; descricao: string; dialogTitulo: string }
> = {
  literal: {
    titulo: "Consolidar registros",
    botao: "Consolidar",
    descricao:
      "A IA reorganiza os registros em ordem cronológica e remove repetições literais. Não interpreta evolução — mantém os fatos como foram escritos.",
    dialogTitulo: "Consolidar registros",
  },
  evolutivo: {
    titulo: "Gerar síntese evolutiva",
    botao: "Gerar síntese",
    descricao:
      "A IA organiza os fatos cronologicamente e destaca progressos ou dificuldades apenas quando houver evidência clara e explícita nos registros.",
    dialogTitulo: "Gerar síntese evolutiva",
  },
}

export function ConsolidarModal({
  modo,
  criancaId,
  criancaNome,
  turmaId,
  onUsarComoRascunho,
}: {
  modo: ModoConsolidacao
  criancaId: string
  criancaNome: string
  turmaId: string | null
  onUsarComoRascunho: (texto: string, periodo: { data_inicio: string; data_fim: string }) => void
}) {
  const { professora } = useAuth()
  const [open, setOpen] = useState(false)
  const [resultado, setResultado] = useState<{
    texto: string
    quantidade: number
    statusEvolutivo: StatusEvolutivo | null
    periodo: { data_inicio: string; data_fim: string }
  } | null>(null)
  const [texto, setTexto] = useState("")

  const config = MODO_CONFIG[modo]

  const { data: turma } = useQuery({
    queryKey: ["turma", turmaId],
    queryFn: () => obterTurma(turmaId as string),
    enabled: !!turmaId && open,
  })

  const form = useForm<ConsolidarPeriodoFormValues>({
    resolver: zodResolver(consolidarPeriodoSchema),
    defaultValues: { data_inicio: "", data_fim: "" },
  })

  const mutation = useMutation({
    mutationFn: consolidarRelatorio,
    onSuccess: (dados, variaveis) => {
      setResultado({
        texto: dados.texto,
        quantidade: dados.quantidade_observacoes,
        statusEvolutivo: dados.status_evolutivo,
        periodo: { data_inicio: variaveis.data_inicio, data_fim: variaveis.data_fim },
      })
      setTexto(dados.texto)
    },
    onError: (erro) => {
      toast.error(
        erro instanceof ApiError ? erro.message : "Não foi possível processar as observações."
      )
    },
  })

  function fechar(novoEstado: boolean) {
    setOpen(novoEstado)
    if (!novoEstado) {
      setResultado(null)
      setTexto("")
      form.reset()
      mutation.reset()
    }
  }

  async function copiarTexto() {
    await navigator.clipboard.writeText(texto)
    toast.success("Texto copiado para a área de transferência.")
  }

  function usarComoRascunho() {
    if (!resultado) return
    onUsarComoRascunho(texto, resultado.periodo)
    fechar(false)
  }

  async function exportarPdf() {
    if (!resultado) return
    await exportarRelatorioPdf({
      criancaNome,
      turmaNome: turma?.nome ?? null,
      dataInicio: resultado.periodo.data_inicio,
      dataFim: resultado.periodo.data_fim,
      statusEvolutivo: resultado.statusEvolutivo,
      texto,
      professoraNome: professora?.nome ?? "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={fechar}>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        {modo === "evolutivo" ? (
          <TrendingUpIcon className="size-4" />
        ) : (
          <SparklesIcon className="size-4" />
        )}
        {config.titulo}
      </Button>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{config.dialogTitulo}</DialogTitle>
        </DialogHeader>

        {!resultado ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((dados) =>
                mutation.mutate({ crianca_id: criancaId, modo, ...dados })
              )}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">{config.descricao}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Período - início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Período - fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={mutation.isPending} className="gap-2">
                  <SparklesIcon className="size-4" />
                  {mutation.isPending ? "Processando..." : config.botao}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {resultado.quantidade}{" "}
                {resultado.quantidade === 1 ? "observação organizada" : "observações organizadas"} —
                revise e edite livremente antes de usar.
              </p>
              {resultado.statusEvolutivo && (
                <Badge className={STATUS_BADGE[resultado.statusEvolutivo].className}>
                  {STATUS_BADGE[resultado.statusEvolutivo].label}
                </Badge>
              )}
            </div>
            <Textarea rows={14} value={texto} onChange={(event) => setTexto(event.target.value)} />
            <DialogFooter className="flex-wrap gap-2 sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={copiarTexto}>
                  <CopyIcon className="size-4" />
                  Copiar texto
                </Button>
                <Button variant="outline" className="gap-2" onClick={exportarPdf}>
                  <DownloadIcon className="size-4" />
                  Exportar PDF
                </Button>
              </div>
              <Button onClick={usarComoRascunho} className="gap-2">
                Usar como rascunho
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
