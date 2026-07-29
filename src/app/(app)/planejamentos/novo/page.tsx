import { PageTitle } from "@/components/ui/page-title"
import { PlanejamentoForm } from "@/modules/planejamentos/components/planejamento-form"

export default function NovoPlanejamentoPage() {
  return (
    <div>
      <PageTitle
        title="Novo planejamento"
        description="Escolha o período — os dias úteis serão gerados automaticamente para você preencher."
      />
      <div className="mx-auto max-w-xl">
        <PlanejamentoForm />
      </div>
    </div>
  )
}
