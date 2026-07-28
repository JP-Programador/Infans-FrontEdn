"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Textarea } from "@/components/ui/textarea"
import { AddIcon, RecordIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"
import { criarRegistro } from "@/modules/registros/api"
import { registroSchema, type RegistroFormValues } from "@/modules/registros/schemas"
import { SeletorCrianca } from "@/modules/relatorios/components/seletor-crianca"

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export function RegistroRapidoModal() {
  const [open, setOpen] = useState(false)
  const [criancaId, setCriancaId] = useState("")
  const [criancaNome, setCriancaNome] = useState("")
  const queryClient = useQueryClient()

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: { data: hoje(), texto: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: RegistroFormValues) => criarRegistro({ crianca_id: criancaId, ...dados }),
    onSuccess: () => {
      toast.success("Registro salvo!")
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      form.reset({ data: hoje(), texto: "" })
      setCriancaId("")
      setCriancaNome("")
      setOpen(false)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível salvar o registro.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <RecordIcon className="size-4" />
            Novo registro
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo registro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <SeletorCrianca
            onSelecionar={(id, nome) => {
              setCriancaId(id)
              setCriancaNome(nome)
            }}
          />
          {criancaId && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  Registro para <span className="font-medium text-foreground">{criancaNome}</span>
                </p>
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
                <DialogFooter>
                  <Button type="submit" disabled={mutation.isPending} className="gap-2">
                    <AddIcon className="size-4" />
                    {mutation.isPending ? "Salvando..." : "Salvar registro"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
