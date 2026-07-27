import { apiFetch } from "@/lib/api-client"
import type { Crianca } from "@/lib/types"

export type CriancaInput = {
  nome: string
  data_nascimento: string
  responsavel?: string
  turma_id: string
}
export type CriancaUpdateInput = Partial<Omit<CriancaInput, "turma_id">> & { turma_id?: string }

export function listarCriancas(turmaId: string) {
  return apiFetch<Crianca[]>(`/api/v1/criancas?turma_id=${turmaId}`)
}

export function obterCrianca(criancaId: string) {
  return apiFetch<Crianca>(`/api/v1/criancas/${criancaId}`)
}

export function criarCrianca(dados: CriancaInput) {
  return apiFetch<Crianca>("/api/v1/criancas", { method: "POST", body: dados })
}

export function atualizarCrianca(criancaId: string, dados: CriancaUpdateInput) {
  return apiFetch<Crianca>(`/api/v1/criancas/${criancaId}`, { method: "PUT", body: dados })
}
