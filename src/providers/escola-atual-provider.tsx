"use client"

import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"

import type { Escola } from "@/lib/types"
import { listarEscolas } from "@/modules/escolas/api"

const STORAGE_KEY = "infans:escola_atual"

type EscolaAtualContextValue = {
  escolas: Escola[]
  escolaAtual: Escola | null
  selecionarEscola: (id: string) => void
}

const EscolaAtualContext = createContext<EscolaAtualContextValue | null>(null)

/** Mantém qual escola está "em foco" na navegação (seletor da Navbar, rodapé da
 * Sidebar) — independente dos filtros locais que cada tela já possa ter. */
export function EscolaAtualProvider({ children }: { children: React.ReactNode }) {
  const { data: escolas } = useQuery({ queryKey: ["escolas"], queryFn: listarEscolas })
  const [escolaAtualId, setEscolaAtualId] = useState<string | null>(null)

  useEffect(() => {
    if (!escolas || escolas.length === 0) return
    const salva = window.localStorage.getItem(STORAGE_KEY)
    const valida = salva && escolas.some((escola) => escola.id === salva)
    setEscolaAtualId(valida ? salva : escolas[0].id)
  }, [escolas])

  function selecionarEscola(id: string) {
    setEscolaAtualId(id)
    window.localStorage.setItem(STORAGE_KEY, id)
  }

  const escolaAtual = escolas?.find((escola) => escola.id === escolaAtualId) ?? null

  return (
    <EscolaAtualContext.Provider value={{ escolas: escolas ?? [], escolaAtual, selecionarEscola }}>
      {children}
    </EscolaAtualContext.Provider>
  )
}

export function useEscolaAtual() {
  const context = useContext(EscolaAtualContext)
  if (!context) throw new Error("useEscolaAtual deve ser usado dentro de EscolaAtualProvider")
  return context
}
