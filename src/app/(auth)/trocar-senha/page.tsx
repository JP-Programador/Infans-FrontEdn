import { Suspense } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrocarSenhaForm } from "@/modules/auth/components/trocar-senha-form"

export default function TrocarSenhaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trocar senha</CardTitle>
        <CardDescription>
          Por segurança, é preciso trocar a senha a cada 90 dias. Informe a senha atual e defina uma
          nova.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <TrocarSenhaForm />
        </Suspense>
      </CardContent>
    </Card>
  )
}
