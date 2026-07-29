import { apiDownload, apiFetch } from "@/lib/api-client"
import type {
  Planejamento,
  PlanejamentoCard,
  PlanejamentoColuna,
  PlanejamentoDetalhe,
  PlanejamentoDia,
  PlanejamentoVisualizacao,
  RotuloTurma,
} from "@/lib/types"

export type PlanejamentoInput = {
  titulo: string
  escola_id: string
  turma_id: string
  data_inicio: string
  data_fim: string
  rotulo_turma: RotuloTurma
  colunas?: string[]
  modelo_id?: string
}
export type PlanejamentoUpdateInput = { titulo?: string; status?: "rascunho" | "concluido" }

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
  return apiFetch<PlanejamentoDetalhe>("/api/v1/planejamentos", { method: "POST", body: dados })
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
  return apiFetch<PlanejamentoDetalhe>(`/api/v1/planejamentos/${id}/duplicar`, { method: "POST" })
}

// --------------------------------------------------------------------- colunas

export function listarColunas(planejamentoId: string) {
  return apiFetch<PlanejamentoColuna[]>(`/api/v1/planejamentos/${planejamentoId}/colunas`)
}

export function adicionarColuna(planejamentoId: string, nome: string) {
  return apiFetch<PlanejamentoColuna>(`/api/v1/planejamentos/${planejamentoId}/colunas`, {
    method: "POST",
    body: { nome },
  })
}

export function renomearColuna(planejamentoId: string, colunaId: string, nome: string) {
  return apiFetch<PlanejamentoColuna>(
    `/api/v1/planejamentos/${planejamentoId}/colunas/${colunaId}`,
    { method: "PUT", body: { nome } }
  )
}

export function excluirColuna(planejamentoId: string, colunaId: string) {
  return apiFetch<void>(`/api/v1/planejamentos/${planejamentoId}/colunas/${colunaId}`, {
    method: "DELETE",
  })
}

export function reordenarColunas(planejamentoId: string, ordem: string[]) {
  return apiFetch<PlanejamentoColuna[]>(
    `/api/v1/planejamentos/${planejamentoId}/colunas/reordenar`,
    { method: "PUT", body: { ordem } }
  )
}

export function salvarColunasComoModelo(planejamentoId: string, nome: string) {
  return apiFetch(`/api/v1/planejamentos/${planejamentoId}/colunas/salvar-como-modelo`, {
    method: "POST",
    body: { nome },
  })
}

// ------------------------------------------------------------------------ dias

export function listarDias(planejamentoId: string) {
  return apiFetch<PlanejamentoDia[]>(`/api/v1/planejamentos/${planejamentoId}/dias`)
}

export function atualizarDia(planejamentoId: string, diaId: string, celulas: Record<string, string>) {
  return apiFetch<PlanejamentoDia>(`/api/v1/planejamentos/${planejamentoId}/dias/${diaId}`, {
    method: "PUT",
    body: { celulas },
  })
}

// ------------------------------------------------------------- visualização/export

export function obterVisualizacaoPlanejamento(id: string) {
  return apiFetch<PlanejamentoVisualizacao>(`/api/v1/planejamentos/${id}/visualizacao`)
}

export function exportarPlanejamentoPdf(id: string) {
  return apiDownload(`/api/v1/planejamentos/${id}/pdf`, `planejamento-${id}.pdf`)
}

export function exportarPlanejamentoExcel(id: string) {
  return apiDownload(`/api/v1/planejamentos/${id}/excel`, `planejamento-${id}.xlsx`)
}
