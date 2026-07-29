"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddIcon } from "@/design-system/icons"
import { ApiError } from "@/lib/api-client"

import { criarModelo } from "../modelos-api"
import { type ColunaEditavel, ListaColunas } from "./lista-colunas"

function novoId() {
  return crypto.randomUUID()
}

export function ModeloFormDialog() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [colunas, setColunas] = useState<ColunaEditavel[]>([{ id: novoId(), nome: "" }])
  const [salvando, setSalvando] = useState(false)

  function reiniciar() {
    setNome("")
    setColunas([{ id: novoId(), nome: "" }])
  }

  async function salvar() {
    const nomesColunas = colunas.map((c) => c.nome.trim()).filter(Boolean)
    if (!nome.trim() || nomesColunas.length === 0) {
      toast.error("Informe um nome e ao menos uma coluna.")
      return
    }
    setSalvando(true)
    try {
      await criarModelo({ nome: nome.trim(), colunas: nomesColunas })
      toast.success("Modelo criado!")
      queryClient.invalidateQueries({ queryKey: ["modelos-planejamento"] })
      reiniciar()
      setOpen(false)
    } catch (erro) {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível criar o modelo.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <AddIcon className="size-4" />
            Novo modelo
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo modelo de colunas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome do modelo</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Berçário padrão" />
          </div>
          <div className="space-y-1.5">
            <Label>Colunas</Label>
            <ListaColunas
              colunas={colunas}
              onRenomear={(id, novoNome) =>
                setColunas((atual) => atual.map((c) => (c.id === id ? { ...c, nome: novoNome } : c)))
              }
              onMover={(id, direcao) =>
                setColunas((atual) => {
                  const indice = atual.findIndex((c) => c.id === id)
                  const novoIndice = direcao === "cima" ? indice - 1 : indice + 1
                  if (novoIndice < 0 || novoIndice >= atual.length) return atual
                  const copia = [...atual]
                  ;[copia[indice], copia[novoIndice]] = [copia[novoIndice], copia[indice]]
                  return copia
                })
              }
              onRemover={(id) =>
                setColunas((atual) => (atual.length <= 1 ? atual : atual.filter((c) => c.id !== id)))
              }
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setColunas((atual) => [...atual, { id: novoId(), nome: "" }])}
            >
              <AddIcon className="size-4" />
              Adicionar coluna
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar modelo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
