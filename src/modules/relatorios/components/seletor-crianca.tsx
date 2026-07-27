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
import { listarCriancas } from "@/modules/criancas/api"
import { listarEscolas } from "@/modules/escolas/api"
import { listarTurmas } from "@/modules/turmas/api"

type SeletorCriancaProps = {
  onSelecionar: (criancaId: string, criancaNome: string) => void
}

export function SeletorCrianca({ onSelecionar }: SeletorCriancaProps) {
  const [escolaId, setEscolaId] = useState("")
  const [turmaId, setTurmaId] = useState("")
  const [criancaId, setCriancaId] = useState("")

  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const { data: turmas } = useQuery({
    queryKey: ["turmas", escolaId],
    queryFn: () => listarTurmas(escolaId),
    enabled: !!escolaId,
  })
  const { data: criancas } = useQuery({
    queryKey: ["criancas", turmaId],
    queryFn: () => listarCriancas(turmaId),
    enabled: !!turmaId,
  })

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label>Escola</Label>
        <Select
          value={escolaId}
          onValueChange={(valor) => {
            setEscolaId(valor ?? "")
            setTurmaId("")
            setCriancaId("")
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
            setCriancaId("")
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

      <div className="space-y-1.5">
        <Label>Criança</Label>
        <Select
          value={criancaId}
          onValueChange={(valor) => {
            setCriancaId(valor ?? "")
            const crianca = criancas?.find((item) => item.id === valor)
            if (crianca) onSelecionar(crianca.id, crianca.nome)
          }}
          disabled={!turmaId}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {() => criancas?.find((crianca) => crianca.id === criancaId)?.nome ?? "Selecione a criança"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {criancas?.map((crianca) => (
              <SelectItem key={crianca.id} value={crianca.id}>
                {crianca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
