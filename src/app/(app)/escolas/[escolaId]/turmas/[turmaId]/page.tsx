import { TurmaDetail } from "@/modules/turmas/components/turma-detail"

export default async function TurmaDetailPage({
  params,
}: {
  params: Promise<{ escolaId: string; turmaId: string }>
}) {
  const { turmaId } = await params
  return <TurmaDetail turmaId={turmaId} />
}
