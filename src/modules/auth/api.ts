import { apiFetch } from "@/lib/api-client"
import type { Professora } from "@/lib/types"

import type { CadastroFormValues, LoginFormValues, TrocarSenhaFormValues } from "./schemas"

type TokenResponse = { access_token: string; token_type: string }

export function login(dados: LoginFormValues) {
  return apiFetch<TokenResponse>("/api/v1/auth/login", { method: "POST", body: dados, auth: false })
}

export function registrar(dados: CadastroFormValues) {
  return apiFetch<Professora>("/api/v1/auth/registrar", { method: "POST", body: dados, auth: false })
}

export function trocarSenha(dados: TrocarSenhaFormValues) {
  return apiFetch<TokenResponse>("/api/v1/auth/trocar-senha", {
    method: "POST",
    body: dados,
    auth: false,
  })
}
