import { apiFetch } from "@/lib/api-client"
import type { ModeloPlanejamento } from "@/lib/types"

export type ModeloInput = { nome: string; colunas: string[] }

export function listarModelos() {
  return apiFetch<ModeloPlanejamento[]>("/api/v1/modelos-planejamento")
}

export function criarModelo(dados: ModeloInput) {
  return apiFetch<ModeloPlanejamento>("/api/v1/modelos-planejamento", { method: "POST", body: dados })
}

export function duplicarModelo(id: string) {
  return apiFetch<ModeloPlanejamento>(`/api/v1/modelos-planejamento/${id}/duplicar`, { method: "POST" })
}

export function excluirModelo(id: string) {
  return apiFetch<void>(`/api/v1/modelos-planejamento/${id}`, { method: "DELETE" })
}
