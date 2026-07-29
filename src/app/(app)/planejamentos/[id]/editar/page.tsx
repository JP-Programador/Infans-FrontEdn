import { PageTitle } from "@/components/ui/page-title"
import { DiaPlanejamentoForm } from "@/modules/planejamentos/components/dia-planejamento-form"

export default async function EditarPlanejamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle
        title="Preencher planejamento"
        description="Um dia por vez — suas respostas são salvas automaticamente."
      />
      <DiaPlanejamentoForm planejamentoId={id} />
    </div>
  )
}
