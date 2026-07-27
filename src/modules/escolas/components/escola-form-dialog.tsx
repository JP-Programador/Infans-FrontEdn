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
  DialogDescription,
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

import { criarEscola } from "../api"
import { escolaSchema, type EscolaFormValues } from "../schemas"

export function EscolaFormDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<EscolaFormValues>({
    resolver: zodResolver(escolaSchema),
    defaultValues: { nome: "", cidade: "", estado: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: EscolaFormValues) =>
      criarEscola({
        nome: dados.nome,
        cidade: dados.cidade || undefined,
        estado: dados.estado || undefined,
      }),
    onSuccess: () => {
      toast.success("Escola criada com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["escolas"] })
      form.reset()
      setOpen(false)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível criar a escola.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="size-4" />
            Nova escola
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova escola</DialogTitle>
          <DialogDescription>Você será automaticamente vinculada a ela.</DialogDescription>
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
                    <Input placeholder="Ex: Escola Girassol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="UF" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Criando..." : "Criar escola"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
