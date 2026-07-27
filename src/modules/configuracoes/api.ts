import { apiFetch } from "@/lib/api-client"
import type { Configuracao } from "@/lib/types"

export type ConfiguracaoUpdateInput = { dias_alerta_sem_registro?: number; nome_sistema?: string }

export function obterConfiguracao() {
  return apiFetch<Configuracao>("/api/v1/configuracoes/me")
}

export function atualizarConfiguracao(dados: ConfiguracaoUpdateInput) {
  return apiFetch<Configuracao>("/api/v1/configuracoes/me", { method: "PUT", body: dados })
}
