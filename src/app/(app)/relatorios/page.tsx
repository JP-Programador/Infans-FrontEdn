import { PageHeader } from "@/components/shared/page-header"
import { FluxoRelatorio } from "@/modules/relatorios/components/fluxo-relatorio"

export default function RelatoriosPage() {
  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Selecione uma criança e um período para consolidar os registros com a IA."
      />
      <FluxoRelatorio />
    </div>
  )
}
