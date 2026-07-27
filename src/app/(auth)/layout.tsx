export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Infans</h1>
          <p className="text-sm text-muted-foreground">Seu Agente — Prontuário Pedagógico Digital</p>
        </div>
        {children}
      </div>
    </div>
  )
}
