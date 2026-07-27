"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ApiError } from "@/lib/api-client"

import { criarCrianca } from "../api"
import { criancaSchema, type CriancaFormValues } from "../schemas"

export function CriancaFormDialog({ turmaId }: { turmaId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CriancaFormValues>({
    resolver: zodResolver(criancaSchema),
    defaultValues: { nome: "", data_nascimento: "", responsavel: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: CriancaFormValues) =>
      criarCrianca({
        nome: dados.nome,
        data_nascimento: dados.data_nascimento,
        responsavel: dados.responsavel || undefined,
        turma_id: turmaId,
      }),
    onSuccess: () => {
      toast.success("Criança cadastrada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["criancas", turmaId] })
      form.reset()
      setOpen(false)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível cadastrar a criança.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="size-4" />
            Nova criança
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova criança</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
