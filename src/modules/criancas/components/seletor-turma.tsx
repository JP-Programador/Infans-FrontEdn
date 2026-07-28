"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listarEscolas } from "@/modules/escolas/api"
import { listarTurmas } from "@/modules/turmas/api"

type SeletorTurmaProps = {
  onSelecionar: (turmaId: string) => void
}

/** Seleção em cascata Escola -> Turma (sem o nível de criança), usada nos fluxos
 * que precisam apenas de uma turma de destino, como cadastrar uma nova criança. */
export function SeletorTurma({ onSelecionar }: SeletorTurmaProps) {
  const [escolaId, setEscolaId] = useState("")
  const [turmaId, setTurmaId] = useState("")

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: turmas } = useQuery({
    queryKey: ["turmas", escolaId],
    queryFn: () => listarTurmas(escolaId),
    enabled: !!escolaId,
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Escola</Label>
        <Select
          value={escolaId}
          onValueChange={(valor) => {
            setEscolaId(valor ?? "")
            setTurmaId("")
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {() => escolas?.find((escola) => escola.id === escolaId)?.nome ?? "Selecione a escola"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {escolas?.map((escola) => (
              <SelectItem key={escola.id} value={escola.id}>
                {escola.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Turma</Label>
        <Select
          value={turmaId}
          onValueChange={(valor) => {
            setTurmaId(valor ?? "")
            if (valor) onSelecionar(valor)
          }}
          disabled={!escolaId}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {() => turmas?.find((turma) => turma.id === turmaId)?.nome ?? "Selecione a turma"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {turmas?.map((turma) => (
              <SelectItem key={turma.id} value={turma.id}>
                {turma.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
