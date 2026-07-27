import { EscolaDetail } from "@/modules/escolas/components/escola-detail"

export default async function EscolaDetailPage({
  params,
}: {
  params: Promise<{ escolaId: string }>
}) {
  const { escolaId } = await params
  return <EscolaDetail escolaId={escolaId} />
}
