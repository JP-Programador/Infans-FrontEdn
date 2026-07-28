import { PageTitle } from "@/components/ui/page-title"
import { FluxoRelatorio } from "@/modules/relatorios/components/fluxo-relatorio"

export default function RelatoriosPage() {
  return (
    <div>
      <PageTitle
        title="Relatórios"
        description="Selecione uma criança e um período para consolidar os registros com a IA."
      />
      <FluxoRelatorio />
    </div>
  )
}
