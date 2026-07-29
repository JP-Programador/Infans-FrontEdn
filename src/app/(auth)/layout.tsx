import { Logo, LogoMark } from "@/components/ui/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-12 text-white lg:flex">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <LogoMark className="size-7" />
          </div>
          <span className="text-2xl font-semibold">Infans</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl leading-tight font-semibold">
            Gestão pedagógica que acompanha cada descoberta.
          </h2>
          <p className="mt-4 text-white/80">
            Organize seus registros, acompanhe o desenvolvimento das crianças e gere
            relatórios com apoio de IA.
          </p>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-16 size-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <Logo className="mx-auto" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
