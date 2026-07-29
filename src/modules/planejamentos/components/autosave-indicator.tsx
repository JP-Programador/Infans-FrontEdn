import { CheckIcon, SpinnerIcon } from "@/design-system/icons"
import { cn } from "@/lib/utils"

import type { AutosaveStatus } from "../use-autosave"

const CONFIG: Record<AutosaveStatus, { label: string; className: string }> = {
  salvo: { label: "Salvo", className: "text-support-green" },
  pendente: { label: "Alterações não salvas", className: "text-muted-foreground" },
  salvando: { label: "Salvando...", className: "text-muted-foreground" },
  erro: { label: "Erro ao salvar — tentando novamente", className: "text-destructive" },
}

export function AutosaveIndicator({ status, className }: { status: AutosaveStatus; className?: string }) {
  const config = CONFIG[status]

  return (
    <span className={cn("flex items-center gap-1.5 text-xs font-medium", config.className, className)}>
      {status === "salvando" && <SpinnerIcon className="size-3.5 animate-spin" />}
      {status === "salvo" && <CheckIcon className="size-3.5" />}
      {config.label}
    </span>
  )
}
