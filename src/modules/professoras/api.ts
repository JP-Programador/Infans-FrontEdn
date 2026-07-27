import { apiFetch } from "@/lib/api-client"
import type { Professora } from "@/lib/types"

export type ProfessoraUpdateInput = { nome?: string; email?: string }

export function atualizarDadosDaConta(dados: ProfessoraUpdateInput) {
  return apiFetch<Professora>("/api/v1/professoras/me", { method: "PUT", body: dados })
}
