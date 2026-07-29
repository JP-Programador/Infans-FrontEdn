"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from "@/design-system/icons"

export type ColunaEditavel = { id: string; nome: string }

/** Lista pura de colunas com renomear/reordenar/remover — sem opinião sobre se
 * as mudanças são só locais (criação) ou já persistidas (edição ao vivo). */
export function ListaColunas({
  colunas,
  onRenomear,
  onRenomearConcluido,
  onMover,
  onRemover,
  permiteRemoverUltima = false,
}: {
  colunas: ColunaEditavel[]
  onRenomear: (id: string, nome: string) => void
  onRenomearConcluido?: (id: string) => void
  onMover: (id: string, direcao: "cima" | "baixo") => void
  onRemover: (id: string) => void
  permiteRemoverUltima?: boolean
}) {
  return (
    <div className="space-y-2">
      {colunas.map((coluna, indice) => (
        <div key={coluna.id} className="flex items-center gap-2">
          <Input
            value={coluna.nome}
            onChange={(e) => onRenomear(coluna.id, e.target.value)}
            onBlur={() => onRenomearConcluido?.(coluna.id)}
            placeholder="Nome da coluna"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={indice === 0}
            onClick={() => onMover(coluna.id, "cima")}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={indice === colunas.length - 1}
            onClick={() => onMover(coluna.id, "baixo")}
          >
            <ArrowDownIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!permiteRemoverUltima && colunas.length <= 1}
            onClick={() => onRemover(coluna.id)}
          >
            <DeleteIcon className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
