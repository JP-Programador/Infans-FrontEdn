"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AddIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"
import type { PlanejamentoColuna } from "@/lib/types"

import { adicionarColuna, excluirColuna, reordenarColunas, renomearColuna } from "../api"
import { type ColunaEditavel, ListaColunas } from "./lista-colunas"

export function EditarColunasDialog({
  planejamentoId,
  colunas,
  onMudou,
  trigger,
}: {
  planejamentoId: string
  colunas: PlanejamentoColuna[]
  onMudou: () => void
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [locais, setLocais] = useState<ColunaEditavel[]>([])
  const [nomeNovaColuna, setNomeNovaColuna] = useState("")
  const [processando, setProcessando] = useState(false)

  useEffect(() => {
    if (open) setLocais(colunas.map((c) => ({ id: c.id, nome: c.nome })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function tratarErro(erro: unknown, mensagemPadrao: string) {
    toast.error(erro instanceof ApiError ? erro.message : mensagemPadrao)
  }

  async function aoAdicionar() {
    if (!nomeNovaColuna.trim()) return
    setProcessando(true)
    try {
      const nova = await adicionarColuna(planejamentoId, nomeNovaColuna.trim())
      setLocais((atual) => [...atual, { id: nova.id, nome: nova.nome }])
      setNomeNovaColuna("")
      onMudou()
    } catch (erro) {
      tratarErro(erro, "Não foi possível adicionar a coluna.")
    } finally {
      setProcessando(false)
    }
  }

  async function aoRenomear(id: string, nome: string) {
    setLocais((atual) => atual.map((c) => (c.id === id ? { ...c, nome } : c)))
  }

  async function aoSalvarRenomeacao(id: string) {
    const coluna = locais.find((c) => c.id === id)
    if (!coluna) return
    try {
      await renomearColuna(planejamentoId, id, coluna.nome)
      onMudou()
    } catch (erro) {
      tratarErro(erro, "Não foi possível renomear a coluna.")
    }
  }

  async function aoMover(id: string, direcao: "cima" | "baixo") {
    const indice = locais.findIndex((c) => c.id === id)
    const novoIndice = direcao === "cima" ? indice - 1 : indice + 1
    if (novoIndice < 0 || novoIndice >= locais.length) return
    const copia = [...locais]
    ;[copia[indice], copia[novoIndice]] = [copia[novoIndice], copia[indice]]
    setLocais(copia)
    try {
      await reordenarColunas(planejamentoId, copia.map((c) => c.id))
      onMudou()
    } catch (erro) {
      tratarErro(erro, "Não foi possível reordenar as colunas.")
    }
  }

  async function aoRemover(id: string) {
    if (locais.length <= 1) return
    setProcessando(true)
    try {
      await excluirColuna(planejamentoId, id)
      setLocais((atual) => atual.filter((c) => c.id !== id))
      onMudou()
    } catch (erro) {
      tratarErro(erro, "Não foi possível remover a coluna.")
    } finally {
      setProcessando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar colunas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Só a coluna Data é fixa. Renomeie, reordene ou remova as demais — as mudanças são salvas na
            hora.
          </p>
          <ListaColunas
            colunas={locais}
            onRenomear={aoRenomear}
            onRenomearConcluido={aoSalvarRenomeacao}
            onMover={aoMover}
            onRemover={aoRemover}
          />
          <div className="flex items-end gap-2 border-t border-border pt-3">
            <Input
              value={nomeNovaColuna}
              onChange={(e) => setNomeNovaColuna(e.target.value)}
              placeholder="Nome da nova coluna"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={!nomeNovaColuna.trim() || processando}
              onClick={aoAdicionar}
            >
              <AddIcon className="size-4" />
              Adicionar
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              // onBlur já salva renomeações — garante que a última edição em foco também seja salva.
              locais.forEach((coluna) => aoSalvarRenomeacao(coluna.id))
              setOpen(false)
            }}
          >
            Concluído
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
