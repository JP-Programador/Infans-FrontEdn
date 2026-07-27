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

import { criarTurma } from "../api"
import { turmaSchema, type TurmaFormValues } from "../schemas"

export function TurmaFormDialog({ escolaId }: { escolaId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    defaultValues: { nome: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: TurmaFormValues) => criarTurma({ escola_id: escolaId, nome: dados.nome }),
    onSuccess: () => {
      toast.success("Turma criada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["turmas", escolaId] })
      form.reset()
      setOpen(false)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível criar a turma.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="size-4" />
            Nova turma
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova turma</DialogTitle>
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
                    <Input placeholder="Ex: Maternal I" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Criando..." : "Criar turma"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
