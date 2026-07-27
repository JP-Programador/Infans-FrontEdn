import { getToken } from "@/lib/auth-storage"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  status: number
  errorCode?: string

  constructor(message: string, status: number, errorCode?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errorCode = errorCode
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  auth?: boolean
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options

  const finalHeaders = new Headers(headers)
  finalHeaders.set("Content-Type", "application/json")

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(extrairMensagemDeErro(data), response.status, data?.error_code)
  }

  return data as T
}

function extrairMensagemDeErro(data: unknown): string {
  if (data && typeof data === "object") {
    const registro = data as Record<string, unknown>
    if (typeof registro.message === "string") return registro.message
    if (typeof registro.detail === "string") return registro.detail
    if (Array.isArray(registro.detail) && registro.detail[0]?.msg) {
      return String(registro.detail[0].msg)
    }
  }
  return "Ocorreu um erro inesperado. Tente novamente."
}
