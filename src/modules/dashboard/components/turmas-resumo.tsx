import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassIcon } from "@/design-system/icons"
import type { TurmaResumo } from "@/lib/types"

export function TurmasResumo({ turmas }: { turmas: TurmaResumo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Turmas</CardTitle>
        <CardDescription>Quantidade de crianças por turma.</CardDescription>
      </CardHeader>
      <CardContent>
        {turmas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma turma cadastrada ainda.</p>
        ) : (
          <ul className="space-y-1">
            {turmas.map((turma) => (
              <li
                key={turma.turma_id}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-support-blue-soft text-support-blue">
                    <ClassIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{turma.turma_nome}</p>
                    <p className="text-xs text-muted-foreground">{turma.escola_nome}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{turma.quantidade_criancas}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
