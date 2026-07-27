import { apiFetch } from "@/lib/api-client"
import type { Dashboard } from "@/lib/types"

export function obterDashboard(escolaId?: string) {
  const query = escolaId ? `?escola_id=${escolaId}` : ""
  return apiFetch<Dashboard>(`/api/v1/dashboard${query}`)
}
