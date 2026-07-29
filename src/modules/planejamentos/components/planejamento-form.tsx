"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"
import { listarEscolas } from "@/modules/escolas/api"
import { listarTurmas } from "@/modules/turmas/api"

import { criarPlanejamento } from "../api"
import { criarModelo, listarModelos } from "../modelos-api"
import { planejamentoSchema, type PlanejamentoFormValues } from "../schemas"
import { type ColunaEditavel, ListaColunas } from "./lista-colunas"

const COLUNAS_SUGERIDAS = [
  "Objetivo",
  "Campo de experiência",
  "Objetivos BNCC",
  "Desenvolvimento da aula",
  "Avaliação",
  "Materiais",
  "Observações",
  "Intervenção",
  "Registro",
]

function novoId() {
  return crypto.randomUUID()
}

export function PlanejamentoForm() {
  const router = useRouter()
  const [escolaId, setEscolaId] = useState("")
  const [colunas, setColunas] = useState<ColunaEditavel[]>([{ id: novoId(), nome: "" }])
  const [nomeNovoModelo, setNomeNovoModelo] = useState("")
  const [salvandoModelo, setSalvandoModelo] = useState(false)

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: turmas } = useQuery({
    queryKey: ["turmas", escolaId],
    queryFn: () => listarTurmas(escolaId),
    enabled: !!escolaId,
  })
  const { data: modelos } = useQuery({ queryKey: ["modelos-planejamento"], queryFn: listarModelos })

  const form = useForm<PlanejamentoFormValues>({
    resolver: zodResolver(planejamentoSchema),
    defaultValues: {
      titulo: "",
      escola_id: "",
      turma_id: "",
      data_inicio: "",
      data_fim: "",
      rotulo_turma: "turma",
    },
  })

  const mutation = useMutation({
    mutationFn: criarPlanejamento,
    onSuccess: (planejamento) => {
      toast.success("Planejamento criado! Agora é só preencher dia a dia.")
      router.push(`/planejamentos/${planejamento.id}/editar`)
    },
    onError: (erro) => {
      toast.error(
        erro instanceof ApiError ? erro.message : "Não foi possível criar o planejamento."
      )
    },
  })

  function aplicarModelo(modeloId: string) {
    const modelo = modelos?.find((m) => m.id === modeloId)
    if (!modelo) return
    setColunas(modelo.colunas.map((nome) => ({ id: novoId(), nome })))
  }

  function adicionarColuna(nomeSugerido = "") {
    setColunas((atual) => [...atual, { id: novoId(), nome: nomeSugerido }])
  }

  function renomearColuna(id: string, nome: string) {
    setColunas((atual) => atual.map((c) => (c.id === id ? { ...c, nome } : c)))
  }

  function moverColuna(id: string, direcao: "cima" | "baixo") {
    setColunas((atual) => {
      const indice = atual.findIndex((c) => c.id === id)
      const novoIndice = direcao === "cima" ? indice - 1 : indice + 1
      if (novoIndice < 0 || novoIndice >= atual.length) return atual
      const copia = [...atual]
      ;[copia[indice], copia[novoIndice]] = [copia[novoIndice], copia[indice]]
      return copia
    })
  }

  function removerColuna(id: string) {
    setColunas((atual) => (atual.length <= 1 ? atual : atual.filter((c) => c.id !== id)))
  }

  async function salvarComoModelo() {
    const nomesColunas = colunas.map((c) => c.nome.trim()).filter(Boolean)
    if (!nomeNovoModelo.trim() || nomesColunas.length === 0) return
    setSalvandoModelo(true)
    try {
      await criarModelo({ nome: nomeNovoModelo.trim(), colunas: nomesColunas })
      toast.success("Modelo salvo! Ele já aparece na lista de modelos para reutilizar.")
      setNomeNovoModelo("")
    } catch (erro) {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível salvar o modelo.")
    } finally {
      setSalvandoModelo(false)
    }
  }

  function aoEnviar(dados: PlanejamentoFormValues) {
    const nomesColunas = colunas.map((c) => c.nome.trim()).filter(Boolean)
    if (nomesColunas.length === 0) {
      toast.error("Adicione ao menos uma coluna antes de criar o planejamento.")
      return
    }
    mutation.mutate({ ...dados, colunas: nomesColunas })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoEnviar)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Semana 30/03 a 03/04" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="escola_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(valor) => {
                          field.onChange(valor ?? "")
                          setEscolaId(valor ?? "")
                          form.setValue("turma_id", "")
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {() => escolas?.find((e) => e.id === field.value)?.nome ?? "Selecione a escola"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {escolas?.map((escola) => (
                            <SelectItem key={escola.id} value={escola.id}>
                              {escola.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="turma_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(valor) => field.onChange(valor ?? "")}
                        disabled={!escolaId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {() => turmas?.find((t) => t.id === field.value)?.nome ?? "Selecione a turma"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {turmas?.map((turma) => (
                            <SelectItem key={turma.id} value={turma.id}>
                              {turma.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rotulo_turma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como você chama a turma?</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(valor) => field.onChange(valor ?? "turma")}>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {() => (field.value === "agrupamento" ? "Agrupamento" : "Turma")}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="turma">Turma</SelectItem>
                          <SelectItem value="agrupamento">Agrupamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data inicial</FormLabel>
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
                    <FormItem>
                      <FormLabel>Data final</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Os dias úteis (segunda a sexta) do período serão gerados automaticamente para você
                preencher um de cada vez.
              </p>

              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? "Criando..." : "Criar planejamento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="font-heading text-base font-medium text-foreground">Etapa 1 — Configure as colunas</p>
            <p className="text-sm text-muted-foreground">
              Só a coluna Data é fixa. Adicione, renomeie, reordene ou remova as demais como quiser.
            </p>
          </div>

          {modelos && modelos.length > 0 && (
            <div className="space-y-1.5">
              <Label>Aplicar um modelo salvo</Label>
              <Select value="" onValueChange={(valor) => valor && aplicarModelo(valor)}>
                <SelectTrigger className="w-full">
                  <SelectValue>{() => "Selecione um modelo para preencher as colunas"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {modelos.map((modelo) => (
                    <SelectItem key={modelo.id} value={modelo.id}>
                      {modelo.nome} ({modelo.colunas.length} colunas)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ListaColunas
            colunas={colunas}
            onRenomear={renomearColuna}
            onMover={moverColuna}
            onRemover={removerColuna}
          />

          <Button type="button" variant="outline" className="gap-2" onClick={() => adicionarColuna()}>
            <AddIcon className="size-4" />
            Adicionar coluna
          </Button>

          <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
            <p className="w-full text-xs text-muted-foreground">Sugestões:</p>
            {COLUNAS_SUGERIDAS.map((nome) => (
              <Button
                key={nome}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adicionarColuna(nome)}
              >
                + {nome}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
            <div className="flex-1 space-y-1.5">
              <Label>Salvar este conjunto como modelo (opcional)</Label>
              <Input
                value={nomeNovoModelo}
                onChange={(e) => setNomeNovoModelo(e.target.value)}
                placeholder="Ex.: Berçário padrão"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!nomeNovoModelo.trim() || salvandoModelo}
              onClick={salvarComoModelo}
            >
              {salvandoModelo ? "Salvando..." : "Salvar modelo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
