import { apiDownload, apiFetch } from "@/lib/api-client"
import type {
  Planejamento,
  PlanejamentoCard,
  PlanejamentoDetalhe,
  PlanejamentoItem,
  PlanejamentoVisualizacao,
} from "@/lib/types"

export type PlanejamentoInput = {
  titulo: string
  escola_id: string
  turma_id: string
  data_inicio: string
  data_fim: string
}
export type PlanejamentoUpdateInput = { titulo?: string; status?: "rascunho" | "concluido" }
export type PlanejamentoItemUpdateInput = Partial<
  Pick<
    PlanejamentoItem,
    | "objetivo_aprendizagem"
    | "expectativa_criancas"
    | "atividades_estrategias"
    | "materiais"
    | "organizacao_tempo_espaco"
  >
>

export type PlanejamentoListaOutput = {
  items: PlanejamentoCard[]
  total: number
  page: number
  page_size: number
}

export function listarPlanejamentos(page = 1, pageSize = 20) {
  return apiFetch<PlanejamentoListaOutput>(
    `/api/v1/planejamentos?page=${page}&page_size=${pageSize}`
  )
}

export function criarPlanejamento(dados: PlanejamentoInput) {
  return apiFetch<Planejamento>("/api/v1/planejamentos", { method: "POST", body: dados })
}

export function obterPlanejamento(id: string) {
  return apiFetch<PlanejamentoDetalhe>(`/api/v1/planejamentos/${id}`)
}

export function atualizarPlanejamento(id: string, dados: PlanejamentoUpdateInput) {
  return apiFetch<Planejamento>(`/api/v1/planejamentos/${id}`, { method: "PUT", body: dados })
}

export function excluirPlanejamento(id: string) {
  return apiFetch<void>(`/api/v1/planejamentos/${id}`, { method: "DELETE" })
}

export function duplicarPlanejamento(id: string) {
  return apiFetch<Planejamento>(`/api/v1/planejamentos/${id}/duplicar`, { method: "POST" })
}

export function listarItensPlanejamento(id: string) {
  return apiFetch<PlanejamentoItem[]>(`/api/v1/planejamentos/${id}/itens`)
}

export function atualizarItemPlanejamento(
  planejamentoId: string,
  itemId: string,
  dados: PlanejamentoItemUpdateInput
) {
  return apiFetch<PlanejamentoItem>(
    `/api/v1/planejamentos/${planejamentoId}/itens/${itemId}`,
    { method: "PUT", body: dados }
  )
}

export function obterVisualizacaoPlanejamento(id: string) {
  return apiFetch<PlanejamentoVisualizacao>(`/api/v1/planejamentos/${id}/visualizacao`)
}

export function exportarPlanejamentoPdf(id: string) {
  return apiDownload(`/api/v1/planejamentos/${id}/pdf`, `planejamento-${id}.pdf`)
}

export function exportarPlanejamentoExcel(id: string) {
  return apiDownload(`/api/v1/planejamentos/${id}/excel`, `planejamento-${id}.xlsx`)
}
