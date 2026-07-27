"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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
import { useAuth } from "@/providers/auth-provider"

import { atualizarDadosDaConta } from "../api"
import { dadosContaSchema, type DadosContaFormValues } from "../schemas"

export function DadosContaForm() {
  const { professora, atualizarProfessora } = useAuth()

  const form = useForm<DadosContaFormValues>({
    resolver: zodResolver(dadosContaSchema),
    defaultValues: { nome: professora?.nome ?? "", email: professora?.email ?? "" },
  })

  const mutation = useMutation({
    mutationFn: atualizarDadosDaConta,
    onSuccess: (dados) => {
      toast.success("Dados atualizados!")
      atualizarProfessora(dados)
    },
    onError: (erro) => {
      if (erro instanceof ApiError && erro.errorCode === "EMAIL_EXISTS") {
        toast.error("Já existe uma professora cadastrada com este email.")
        return
      }
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível atualizar os dados.")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados da conta</CardTitle>
        <CardDescription>Nome e email usados para acessar o sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar dados"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
