import { SpinnerIcon } from "@/design-system/icons"
import { cn } from "@/lib/utils"

export function Loading({
  label = "Carregando...",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      data-slot="loading"
      className={cn("flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground", className)}
    >
      <SpinnerIcon className="size-4 animate-spin" />
      {label}
    </div>
  )
}
