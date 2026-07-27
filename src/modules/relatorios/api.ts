import { apiFetch } from "@/lib/api-client"
import type { Relatorio } from "@/lib/types"

export type GerarRelatorioInput = { crianca_id: string; periodo_inicio: string; periodo_fim: string }
export type SalvarRelatorioInput = GerarRelatorioInput & { texto_ia: string; texto_final: string }

export type RelatorioPreview = {
  crianca_id: string
  periodo_inicio: string
  periodo_fim: string
  texto_consolidado: string
}

export function gerarConsolidacao(dados: GerarRelatorioInput) {
  return apiFetch<RelatorioPreview>("/api/v1/relatorios/gerar", { method: "POST", body: dados })
}

export function salvarRelatorio(dados: SalvarRelatorioInput) {
  return apiFetch<Relatorio>("/api/v1/relatorios", { method: "POST", body: dados })
}

export function listarRelatorios(criancaId: string) {
  return apiFetch<Relatorio[]>(`/api/v1/relatorios?crianca_id=${criancaId}`)
}
