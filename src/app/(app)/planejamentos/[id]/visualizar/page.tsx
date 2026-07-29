import { PlanejamentoVisualizacao } from "@/modules/planejamentos/components/planejamento-visualizacao"

export default async function VisualizarPlanejamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PlanejamentoVisualizacao planejamentoId={id} />
}
