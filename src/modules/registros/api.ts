import { apiFetch } from "@/lib/api-client"
import type { RegistroPedagogico } from "@/lib/types"

export type RegistroInput = { crianca_id: string; data: string; texto: string }
export type RegistroUpdateInput = { data?: string; texto: string }

export type HistoricoFiltros = {
  data_inicio?: string
  data_fim?: string
  palavra?: string
}

export function listarHistorico(criancaId: string, filtros: HistoricoFiltros = {}) {
  const params = new URLSearchParams({ crianca_id: criancaId })
  if (filtros.data_inicio) params.set("data_inicio", filtros.data_inicio)
  if (filtros.data_fim) params.set("data_fim", filtros.data_fim)
  if (filtros.palavra) params.set("palavra", filtros.palavra)
  return apiFetch<RegistroPedagogico[]>(`/api/v1/registros?${params.toString()}`)
}

export function criarRegistro(dados: RegistroInput) {
  return apiFetch<RegistroPedagogico>("/api/v1/registros", { method: "POST", body: dados })
}

export function atualizarRegistro(registroId: string, dados: RegistroUpdateInput) {
  return apiFetch<RegistroPedagogico>(`/api/v1/registros/${registroId}`, {
    method: "PUT",
    body: dados,
  })
}
