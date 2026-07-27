import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestOnly } from "@/components/shared/guest-only"
import { CadastroForm } from "@/modules/auth/components/cadastro-form"

export default function CadastroPage() {
  return (
    <GuestOnly>
      <Card>
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Cadastre-se para começar a registrar sua turma.</CardDescription>
        </CardHeader>
        <CardContent>
          <CadastroForm />
        </CardContent>
      </Card>
    </GuestOnly>
  )
}
