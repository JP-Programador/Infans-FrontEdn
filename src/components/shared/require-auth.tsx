"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/providers/auth-provider"

/** Bloqueia o acesso às rotas autenticadas — redireciona ao login se não houver sessão. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { professora, carregando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!carregando && !professora) router.replace("/login")
  }, [carregando, professora, router])

  if (carregando || !professora) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    )
  }

  return <>{children}</>
}
