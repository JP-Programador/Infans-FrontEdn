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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiError } from "@/lib/api-client"
import { listarEscolas } from "@/modules/escolas/api"
import { listarTurmas } from "@/modules/turmas/api"

import { criarPlanejamento } from "../api"
import { planejamentoSchema, type PlanejamentoFormValues } from "../schemas"

export function PlanejamentoForm() {
  const router = useRouter()
  const [escolaId, setEscolaId] = useState("")

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: turmas } = useQuery({
    queryKey: ["turmas", escolaId],
    queryFn: () => listarTurmas(escolaId),
    enabled: !!escolaId,
  })

  const form = useForm<PlanejamentoFormValues>({
    resolver: zodResolver(planejamentoSchema),
    defaultValues: { titulo: "", escola_id: "", turma_id: "", data_inicio: "", data_fim: "" },
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

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))}
            className="space-y-4"
          >
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
  )
}
