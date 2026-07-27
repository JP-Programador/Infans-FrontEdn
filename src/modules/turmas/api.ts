import { apiFetch } from "@/lib/api-client"
import type { Turma } from "@/lib/types"

export type TurmaInput = { escola_id: string; nome: string }
export type TurmaUpdateInput = { nome?: string; ativa?: boolean }

export function listarTurmas(escolaId: string) {
  return apiFetch<Turma[]>(`/api/v1/turmas?escola_id=${escolaId}`)
}

export function obterTurma(turmaId: string) {
  return apiFetch<Turma>(`/api/v1/turmas/${turmaId}`)
}

export function criarTurma(dados: TurmaInput) {
  return apiFetch<Turma>("/api/v1/turmas", { method: "POST", body: dados })
}

export function atualizarTurma(turmaId: string, dados: TurmaUpdateInput) {
  return apiFetch<Turma>(`/api/v1/turmas/${turmaId}`, { method: "PUT", body: dados })
}
