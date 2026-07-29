"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  MoreIcon,
  ViewIcon,
} from "@/design-system/icons"
import { formatarDataBR } from "@/lib/utils"
import type { PlanejamentoCard as PlanejamentoCardType } from "@/lib/types"

import { duplicarPlanejamento, excluirPlanejamento } from "../api"
import { ProgressoPlanejamento } from "./progresso-planejamento"

export function PlanejamentoCard({
  planejamento,
  onMudou,
}: {
  planejamento: PlanejamentoCardType
  onMudou: () => void
}) {
  const router = useRouter()
  const [duplicando, setDuplicando] = useState(false)

  async function duplicar() {
    setDuplicando(true)
    try {
      await duplicarPlanejamento(planejamento.id)
      toast.success("Planejamento duplicado para a próxima semana.")
      onMudou()
    } catch {
      toast.error("Não foi possível duplicar o planejamento.")
    } finally {
      setDuplicando(false)
    }
  }

  async function excluir() {
    await excluirPlanejamento(planejamento.id)
    toast.success("Planejamento excluído.")
    onMudou()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{planejamento.titulo}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <MoreIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push(`/planejamentos/${planejamento.id}/editar`)}>
                <EditIcon className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/planejamentos/${planejamento.id}`)}>
                <ViewIcon className="size-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={duplicar} disabled={duplicando}>
                <CopyIcon className="size-4" />
                Duplicar
              </DropdownMenuItem>
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => e.preventDefault()}
                    closeOnClick={false}
                  >
                    <DeleteIcon className="size-4" />
                    Excluir
                  </DropdownMenuItem>
                }
                title="Excluir planejamento?"
                description="Essa ação não pode ser desfeita — todos os dias preenchidos serão perdidos."
                confirmLabel="Excluir"
                destructive
                onConfirm={excluir}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">
          {planejamento.turma_nome} · {planejamento.escola_nome}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {formatarDataBR(planejamento.data_inicio)} até {formatarDataBR(planejamento.data_fim)}
          </p>
          <Badge variant={planejamento.status === "concluido" ? "default" : "secondary"}>
            {planejamento.status === "concluido" ? "Concluído" : "Rascunho"}
          </Badge>
        </div>
        <ProgressoPlanejamento
          atual={planejamento.quantidade_dias_preenchidos}
          total={planejamento.quantidade_dias}
        />
        <p className="text-xs text-muted-foreground">
          Última edição em {formatarDataBR(planejamento.updated_at.slice(0, 10))}
        </p>
      </CardContent>
    </Card>
  )
}
