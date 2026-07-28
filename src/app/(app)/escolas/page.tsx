import { PageTitle } from "@/components/ui/page-title"
import { EscolaFormDialog } from "@/modules/escolas/components/escola-form-dialog"
import { EscolasList } from "@/modules/escolas/components/escolas-list"

export default function EscolasPage() {
  return (
    <div>
      <PageTitle
        title="Escolas"
        description="Escolas às quais você está vinculada."
        action={<EscolaFormDialog />}
      />
      <EscolasList />
    </div>
  )
}
