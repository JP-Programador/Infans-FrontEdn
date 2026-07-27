"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
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
import { ApiError } from "@/lib/api-client"

import { atualizarConfiguracao, obterConfiguracao } from "../api"
import { configuracaoSchema, type ConfiguracaoFormValues } from "../schemas"

export function ConfiguracaoForm() {
  const queryClient = useQueryClient()
  const { data: configuracao } = useQuery({ queryKey: ["configuracao"], queryFn: obterConfiguracao })

  const form = useForm<ConfiguracaoFormValues>({
    resolver: zodResolver(configuracaoSchema),
    defaultValues: { dias_alerta_sem_registro: 15, nome_sistema: "Infans – Seu Agente" },
  })

  useEffect(() => {
    if (configuracao) form.reset(configuracao)
  }, [configuracao, form])

  const mutation = useMutation({
    mutationFn: atualizarConfiguracao,
    onSuccess: (dados) => {
      toast.success("Configurações salvas!")
      queryClient.setQueryData(["configuracao"], dados)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível salvar as configurações.")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preferências</CardTitle>
        <CardDescription>Personalize os alertas e o nome do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
            <FormField
              control={form.control}
              name="dias_alerta_sem_registro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias para alerta sem registros</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      className="w-32"
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome_sistema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do sistema</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar preferências"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
