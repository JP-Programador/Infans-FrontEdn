import { PageTitle } from "@/components/ui/page-title"
import { AlterarSenhaForm } from "@/modules/auth/components/alterar-senha-form"
import { ConfiguracaoForm } from "@/modules/configuracoes/components/configuracao-form"
import { DadosContaForm } from "@/modules/professoras/components/dados-conta-form"

export default function ConfiguracoesPage() {
  return (
    <div>
      <PageTitle title="Configurações" description="Gerencie sua conta e as preferências do sistema." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <DadosContaForm />
          <AlterarSenhaForm />
        </div>
        <ConfiguracaoForm />
      </div>
    </div>
  )
}
