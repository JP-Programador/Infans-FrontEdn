import { PlanejamentoResumo } from "@/modules/planejamentos/components/planejamento-resumo"

export default async function PlanejamentoResumoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PlanejamentoResumo planejamentoId={id} />
}
