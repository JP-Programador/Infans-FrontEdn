import { useCallback, useEffect, useRef, useState } from "react"

export type AutosaveStatus = "salvo" | "pendente" | "salvando" | "erro"

/** Autosave genérico: dispara `salvar(valor)` 5s (por padrão) após a última
 * mudança, expõe o status para um indicador visual, e permite forçar o save
 * imediatamente (ex.: antes de trocar de dia) para nunca perder dados. */
export function useAutosave<T>(valor: T, salvar: (valor: T) => Promise<void>, delayMs = 5000) {
  const [status, setStatus] = useState<AutosaveStatus>("salvo")
  const valorRef = useRef(valor)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const montadoRef = useRef(false)

  const salvarAgora = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setStatus("salvando")
    try {
      await salvar(valorRef.current)
      setStatus("salvo")
    } catch {
      setStatus("erro")
    }
  }, [salvar])

  useEffect(() => {
    valorRef.current = valor

    if (!montadoRef.current) {
      montadoRef.current = true
      return
    }

    setStatus("pendente")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      salvarAgora()
    }, delayMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, delayMs])

  // Previne perda de dados ao fechar/recarregar a aba com salvamento pendente.
  useEffect(() => {
    function aoSair(evento: BeforeUnloadEvent) {
      if (status === "pendente" || status === "salvando") {
        evento.preventDefault()
        evento.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", aoSair)
    return () => window.removeEventListener("beforeunload", aoSair)
  }, [status])

  return { status, salvarAgora }
}
