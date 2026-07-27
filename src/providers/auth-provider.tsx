"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { apiFetch } from "@/lib/api-client"
import { clearToken, getToken, setToken } from "@/lib/auth-storage"
import type { Professora } from "@/lib/types"

type AuthContextValue = {
  professora: Professora | null
  carregando: boolean
  autenticar: (token: string) => Promise<void>
  atualizarProfessora: (professora: Professora) => void
  sair: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [professora, setProfessora] = useState<Professora | null>(null)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  const carregarProfessora = useCallback(async () => {
    if (!getToken()) {
      setProfessora(null)
      setCarregando(false)
      return
    }
    try {
      const dados = await apiFetch<Professora>("/api/v1/auth/me")
      setProfessora(dados)
    } catch {
      clearToken()
      setProfessora(null)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarProfessora()
  }, [carregarProfessora])

  const autenticar = useCallback(
    async (token: string) => {
      setToken(token)
      setCarregando(true)
      await carregarProfessora()
    },
    [carregarProfessora]
  )

  const sair = useCallback(() => {
    clearToken()
    setProfessora(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider
      value={{ professora, carregando, autenticar, atualizarProfessora: setProfessora, sair }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}
