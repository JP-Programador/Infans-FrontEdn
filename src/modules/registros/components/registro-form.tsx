"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

import { criarRegistro } from "../api"
import { registroSchema, type RegistroFormValues } from "../schemas"

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export function RegistroForm({ criancaId }: { criancaId: string }) {
  const queryClient = useQueryClient()

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: { data: hoje(), texto: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: RegistroFormValues) => criarRegistro({ crianca_id: criancaId, ...dados }),
    onSuccess: () => {
      toast.success("Registro salvo!")
      queryClient.invalidateQueries({ queryKey: ["registros", criancaId] })
      form.reset({ data: hoje(), texto: "" })
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível salvar o registro.")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Novo registro</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" className="w-fit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registro</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Escreva livremente o que observou..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar registro"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
