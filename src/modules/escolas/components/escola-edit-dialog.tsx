"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/api-client"
import type { Escola } from "@/lib/types"

import { atualizarEscola } from "../api"
import { escolaEditSchema, type EscolaEditFormValues } from "../schemas"

export function EscolaEditDialog({ escola }: { escola: Escola }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<EscolaEditFormValues>({
    resolver: zodResolver(escolaEditSchema),
    defaultValues: {
      nome: escola.nome,
      cidade: escola.cidade ?? "",
      estado: escola.estado ?? "",
      ativa: escola.ativa,
    },
  })

  const mutation = useMutation({
    mutationFn: (dados: EscolaEditFormValues) =>
      atualizarEscola(escola.id, {
        nome: dados.nome,
        cidade: dados.cidade || undefined,
        estado: dados.estado || undefined,
        ativa: dados.ativa,
      }),
    onSuccess: () => {
      toast.success("Escola atualizada!")
      queryClient.invalidateQueries({ queryKey: ["escolas", escola.id] })
      queryClient.invalidateQueries({ queryKey: ["escolas"] })
      setOpen(false)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível atualizar a escola.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <Pencil className="size-4" />
            Editar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar escola</DialogTitle>
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
                    <Input {...field} />
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
                      <Input {...field} />
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
                      <Input maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ativa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="mb-0">Escola ativa</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
