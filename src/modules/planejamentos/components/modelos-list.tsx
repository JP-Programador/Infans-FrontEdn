"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { CopyIcon, DeleteIcon, PlanningIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"

import { duplicarModelo, excluirModelo, listarModelos } from "../modelos-api"

export function ModelosList() {
  const queryClient = useQueryClient()
  const { data: modelos, isLoading } = useQuery({
    queryKey: ["modelos-planejamento"],
    queryFn: listarModelos,
  })

  function invalidar() {
    queryClient.invalidateQueries({ queryKey: ["modelos-planejamento"] })
  }

  async function duplicar(id: string) {
    try {
      await duplicarModelo(id)
      toast.success("Modelo duplicado!")
      invalidar()
    } catch (erro) {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível duplicar o modelo.")
    }
  }

  async function excluir(id: string) {
    await excluirModelo(id)
    toast.success("Modelo excluído.")
    invalidar()
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!modelos || modelos.length === 0) {
    return (
      <EmptyState
        icon={PlanningIcon}
        title="Nenhum modelo salvo"
        description="Salve um conjunto de colunas ao criar um planejamento para reutilizá-lo depois."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modelos.map((modelo) => (
        <Card key={modelo.id}>
          <CardHeader>
            <CardTitle className="text-base">{modelo.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {modelo.colunas.map((nome) => (
                <Badge key={nome} variant="outline">
                  {nome}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => duplicar(modelo.id)}>
                <CopyIcon className="size-4" />
                Duplicar
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="outline" size="sm" className="gap-2">
                    <DeleteIcon className="size-4" />
                    Excluir
                  </Button>
                }
                title="Excluir modelo?"
                description="Essa ação não pode ser desfeita."
                confirmLabel="Excluir"
                destructive
                onConfirm={() => excluir(modelo.id)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
