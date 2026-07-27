import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestOnly } from "@/components/shared/guest-only"
import { LoginForm } from "@/modules/auth/components/login-form"

export default function LoginPage() {
  return (
    <GuestOnly>
      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta para continuar seus registros.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </GuestOnly>
  )
}
