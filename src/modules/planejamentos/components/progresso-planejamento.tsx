export function ProgressoPlanejamento({
  atual,
  total,
  className,
}: {
  atual: number
  total: number
  className?: string
}) {
  const percentual = total > 0 ? Math.round((atual / total) * 100) : 0

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Dia {atual} de {total}
        </span>
        <span>{percentual}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  )
}
