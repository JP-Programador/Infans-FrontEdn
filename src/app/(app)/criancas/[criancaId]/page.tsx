import { CriancaDetail } from "@/modules/criancas/components/crianca-detail"

export default async function CriancaDetailPage({
  params,
}: {
  params: Promise<{ criancaId: string }>
}) {
  const { criancaId } = await params
  return <CriancaDetail criancaId={criancaId} />
}
