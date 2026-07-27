"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/providers/auth-provider"

/** Redireciona para o dashboard se a professora já estiver autenticada —
 * usado nas páginas de login/cadastro/troca de senha. */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { professora, carregando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!carregando && professora) router.replace("/dashboard")
  }, [carregando, professora, router])

  if (carregando || professora) return null
  return <>{children}</>
}
