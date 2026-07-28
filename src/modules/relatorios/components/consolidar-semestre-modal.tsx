"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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
import { CopyIcon, SparklesIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"

import { consolidarRelatorio } from "../api"
import { consolidarPeriodoSchema, type ConsolidarPeriodoFormValues } from "../schemas"

export function ConsolidarSemestreModal({
  criancaId,
  onUsarComoRascunho,
}: {
  criancaId: string
  onUsarComoRascunho: (texto: string, periodo: { data_inicio: string; data_fim: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [resultado, setResultado] = useState<{ texto: string; quantidade: number } | null>(null)
  const [texto, setTexto] = useState("")

  const form = useForm<ConsolidarPeriodoFormValues>({
    resolver: zodResolver(consolidarPeriodoSchema),
    defaultValues: { data_inicio: "", data_fim: "" },
  })

  const mutation = useMutation({
    mutationFn: consolidarRelatorio,
    onSuccess: (dados) => {
      setResultado({ texto: dados.texto_consolidado, quantidade: dados.quantidade_observacoes })
      setTexto(dados.texto_consolidado)
    },
    onError: (erro) => {
      toast.error(
        erro instanceof ApiError ? erro.message : "Não foi possível consolidar as observações."
      )
    },
  })

  function fechar(novoEstado: boolean) {
    setOpen(novoEstado)
    if (!novoEstado) {
      setResultado(null)
      setTexto("")
      form.reset()
      mutation.reset()
    }
  }

  async function copiarTexto() {
    await navigator.clipboard.writeText(texto)
    toast.success("Texto copiado para a área de transferência.")
  }

  function usarComoRascunho() {
    const { data_inicio, data_fim } = form.getValues()
    onUsarComoRascunho(texto, { data_inicio, data_fim })
    fechar(false)
  }

  return (
    <Dialog open={open} onOpenChange={fechar}>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <SparklesIcon className="size-4" />
        Consolidar semestre
      </Button>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Consolidar observações</DialogTitle>
        </DialogHeader>

        {!resultado ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((dados) =>
                mutation.mutate({ crianca_id: criancaId, ...dados })
              )}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                A IA apenas organiza as observações que você já escreveu neste período — ela não
                cria, infere ou completa nenhuma informação nova.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Período - início</FormLabel>
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
                    <FormItem className="flex-1">
                      <FormLabel>Período - fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={mutation.isPending} className="gap-2">
                  <SparklesIcon className="size-4" />
                  {mutation.isPending ? "Consolidando..." : "Consolidar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {resultado.quantidade}{" "}
              {resultado.quantidade === 1 ? "observação organizada" : "observações organizadas"} —
              revise e edite livremente antes de usar.
            </p>
            <Textarea
              rows={14}
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
            />
            <DialogFooter className="gap-2 sm:justify-between">
              <Button variant="outline" className="gap-2" onClick={copiarTexto}>
                <CopyIcon className="size-4" />
                Copiar texto
              </Button>
              <Button onClick={usarComoRascunho} className="gap-2">
                Usar como rascunho
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
