"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ApiError } from "@/lib/api-client"
import { formatarDataBR } from "@/lib/utils"

import { gerarConsolidacao, listarRelatorios, salvarRelatorio } from "../api"
import { periodoSchema, type PeriodoFormValues } from "../schemas"
import { SeletorCrianca } from "./seletor-crianca"

type Preview = { periodo_inicio: string; periodo_fim: string; texto: string }

export function FluxoRelatorio() {
  const [criancaId, setCriancaId] = useState("")
  const [criancaNome, setCriancaNome] = useState("")
  const [preview, setPreview] = useState<Preview | null>(null)
  const [textoFinal, setTextoFinal] = useState("")
  const queryClient = useQueryClient()

  const form = useForm<PeriodoFormValues>({
    resolver: zodResolver(periodoSchema),
    defaultValues: { periodo_inicio: "", periodo_fim: "" },
  })

  const { data: relatoriosSalvos } = useQuery({
    queryKey: ["relatorios", criancaId],
    queryFn: () => listarRelatorios(criancaId),
    enabled: !!criancaId,
  })

  const gerarMutation = useMutation({
    mutationFn: gerarConsolidacao,
    onSuccess: (dados) => {
      setPreview({
        periodo_inicio: dados.periodo_inicio,
        periodo_fim: dados.periodo_fim,
        texto: dados.texto_consolidado,
      })
      setTextoFinal(dados.texto_consolidado)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível gerar a consolidação.")
    },
  })

  const salvarMutation = useMutation({
    mutationFn: () =>
      salvarRelatorio({
        crianca_id: criancaId,
        periodo_inicio: preview!.periodo_inicio,
        periodo_fim: preview!.periodo_fim,
        texto_ia: preview!.texto,
        texto_final: textoFinal,
      }),
    onSuccess: () => {
      toast.success("Relatório salvo com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["relatorios", criancaId] })
      setPreview(null)
      setTextoFinal("")
      form.reset()
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível salvar o relatório.")
    },
  })

  function selecionarCrianca(id: string, nome: string) {
    setCriancaId(id)
    setCriancaNome(nome)
    setPreview(null)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Selecione a criança e o período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SeletorCrianca onSelecionar={selecionarCrianca} />
          {criancaId && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((dados) => gerarMutation.mutate({ crianca_id: criancaId, ...dados }))}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <FormField
                  control={form.control}
                  name="periodo_inicio"
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
                  name="periodo_fim"
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
                <Button type="submit" disabled={gerarMutation.isPending}>
                  {gerarMutation.isPending ? "Consolidando..." : "Gerar consolidação"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Revise o relatório de {criancaNome}</CardTitle>
            <CardDescription>
              A IA apenas organizou os registros que você já escreveu — revise e ajuste como preferir antes
              de salvar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={12}
              value={textoFinal}
              onChange={(event) => setTextoFinal(event.target.value)}
            />
            <Button onClick={() => salvarMutation.mutate()} disabled={salvarMutation.isPending}>
              {salvarMutation.isPending ? "Salvando..." : "Salvar relatório"}
            </Button>
          </CardContent>
        </Card>
      )}

      {criancaId && relatoriosSalvos && relatoriosSalvos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Relatórios salvos de {criancaNome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatoriosSalvos.map((relatorio) => (
              <div key={relatorio.id} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">
                  {formatarDataBR(relatorio.periodo_inicio)} até {formatarDataBR(relatorio.periodo_fim)}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{relatorio.texto_final}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
