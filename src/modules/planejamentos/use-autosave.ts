import { useCallback, useEffect, useRef, useState } from "react"

export type AutosaveStatus = "salvo" | "pendente" | "salvando" | "erro"

/** Autosave genérico: dispara `salvar(valor)` 5s (por padrão) após a última
 * mudança, expõe o status para um indicador visual, e permite forçar o save
 * imediatamente (ex.: antes de trocar de dia) para nunca perder dados.
 *
 * `chave` identifica o "registro" atual (ex.: id do item do dia) — quando ela
 * muda, o próximo valor vira a nova baseline "salvo" em vez de ser tratado
 * como uma edição pendente (evita autosave espúrio ao trocar de dia). */
export function useAutosave<T>(
  valor: T,
  salvar: (valor: T) => Promise<void>,
  opts: { delayMs?: number; chave?: string | number } = {}
) {
  const { delayMs = 5000, chave } = opts

  const [status, setStatus] = useState<AutosaveStatus>("salvo")
  const valorRef = useRef(valor)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chaveAnteriorRef = useRef(chave)
  const baselineDefinidaRef = useRef(false)

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
    if (valor === null || valor === undefined) return

    const chaveMudou = chaveAnteriorRef.current !== chave
    chaveAnteriorRef.current = chave

    if (!baselineDefinidaRef.current || chaveMudou) {
      baselineDefinidaRef.current = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setStatus("salvo")
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
  }, [valor, delayMs, chave])

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
