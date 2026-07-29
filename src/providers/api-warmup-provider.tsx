"use client"

import { useEffect, useRef, useState } from "react"

import { LogoMark } from "@/components/ui/logo"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const TIMEOUT_POR_TENTATIVA_MS = 8000
const INTERVALO_ENTRE_TENTATIVAS_MS = 3000
const ATRASO_PARA_MOSTRAR_TELA_MS = 500
const ATRASO_PARA_AVISO_DEMORA_MS = 45000

async function pingSaude(): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_POR_TENTATIVA_MS)
  try {
    const response = await fetch(`${API_URL}/health`, { signal: controller.signal })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/** A API dorme após inatividade (plano free da Render) e pode levar dezenas de
 * segundos para acordar. Dispara duas tentativas em paralelo assim que o app
 * carrega (uma pode se perder enquanto o container ainda está subindo) e
 * continua tentando até responder, mostrando uma tela de carregamento em vez
 * de deixar o usuário preso num formulário sem feedback. */
export function ApiWarmupProvider({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(false)
  const [mostrarTela, setMostrarTela] = useState(false)
  const [demorandoDemais, setDemorandoDemais] = useState(false)
  const cancelado = useRef(false)

  useEffect(() => {
    cancelado.current = false

    const mostrarTelaTimer = setTimeout(() => {
      if (!cancelado.current) setMostrarTela(true)
    }, ATRASO_PARA_MOSTRAR_TELA_MS)

    const avisoDemoraTimer = setTimeout(() => {
      if (!cancelado.current) setDemorandoDemais(true)
    }, ATRASO_PARA_AVISO_DEMORA_MS)

    async function acordarApi() {
      while (!cancelado.current) {
        const [primeiro, segundo] = await Promise.all([pingSaude(), pingSaude()])
        if (primeiro || segundo) {
          if (!cancelado.current) setPronto(true)
          return
        }
        await new Promise((resolve) => setTimeout(resolve, INTERVALO_ENTRE_TENTATIVAS_MS))
      }
    }

    acordarApi()

    return () => {
      cancelado.current = true
      clearTimeout(mostrarTelaTimer)
      clearTimeout(avisoDemoraTimer)
    }
  }, [])

  if (pronto) return <>{children}</>

  if (!mostrarTela) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LogoMark className="size-9 animate-pulse" />
      </div>
      {!demorandoDemais ? (
        <div className="space-y-1">
          <p className="font-medium text-foreground">Preparando o sistema...</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Isso pode levar até um minuto quando o Infans está sendo acessado após um
            tempo parado.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="font-medium text-foreground">Está demorando mais que o esperado</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            O sistema pode estar passando por instabilidade. Continuamos tentando
            conectar automaticamente — não é necessário fazer nada.
          </p>
        </div>
      )}
    </div>
  )
}
