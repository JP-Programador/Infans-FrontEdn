import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/ui/page-title"
import { AddIcon } from "@/design-system/icons"
import { PlanejamentosList } from "@/modules/planejamentos/components/planejamentos-list"

export default function PlanejamentosPage() {
  return (
    <div>
      <PageTitle
        title="Planejamento Pedagógico Semanal"
        description="Cronogramas semanais de atividades, preenchidos dia a dia."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/planejamentos/modelos">
              <Button variant="outline">Modelos</Button>
            </Link>
            <Link href="/planejamentos/novo">
              <Button className="gap-2">
                <AddIcon className="size-4" />
                Novo planejamento
              </Button>
            </Link>
          </div>
        }
      />
      <PlanejamentosList />
    </div>
  )
}
