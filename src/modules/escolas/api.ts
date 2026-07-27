import { apiFetch } from "@/lib/api-client"
import type { Escola, Professora } from "@/lib/types"

export type EscolaInput = { nome: string; cidade?: string; estado?: string }
export type EscolaUpdateInput = Partial<EscolaInput> & { ativa?: boolean }

export function listarEscolas() {
  return apiFetch<Escola[]>("/api/v1/escolas")
}

export function obterEscola(escolaId: string) {
  return apiFetch<Escola>(`/api/v1/escolas/${escolaId}`)
}

export function criarEscola(dados: EscolaInput) {
  return apiFetch<Escola>("/api/v1/escolas", { method: "POST", body: dados })
}

export function atualizarEscola(escolaId: string, dados: EscolaUpdateInput) {
  return apiFetch<Escola>(`/api/v1/escolas/${escolaId}`, { method: "PUT", body: dados })
}

export function listarProfessorasDaEscola(escolaId: string) {
  return apiFetch<Professora[]>(`/api/v1/escolas/${escolaId}/professoras`)
}

export function vincularProfessora(escolaId: string, email: string) {
  return apiFetch<Professora>(`/api/v1/escolas/${escolaId}/professoras`, {
    method: "POST",
    body: { email },
  })
}
