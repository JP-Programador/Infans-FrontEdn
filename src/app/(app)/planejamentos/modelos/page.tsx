import { PageTitle } from "@/components/ui/page-title"
import { ModeloFormDialog } from "@/modules/planejamentos/components/modelo-form-dialog"
import { ModelosList } from "@/modules/planejamentos/components/modelos-list"

export default function ModelosPlanejamentoPage() {
  return (
    <div>
      <PageTitle
        title="Modelos de planejamento"
        description="Conjuntos de colunas salvos para reutilizar ao criar novos planejamentos."
        action={<ModeloFormDialog />}
      />
      <ModelosList />
    </div>
  )
}
