"use client"

import { FileText, LayoutDashboard, LogOut, School, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/escolas", label: "Escolas", icon: School },
  { href: "/relatorios", label: "Relatórios", icon: FileText },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { professora, sair } = useAuth()

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="px-5 py-6">
          <p className="text-lg font-semibold text-sidebar-foreground">Infans</p>
          <p className="text-xs text-muted-foreground">Seu Agente</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const ativo = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  ativo && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 px-2">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{professora?.nome}</p>
            <p className="truncate text-xs text-muted-foreground">{professora?.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={sair}>
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">Infans</p>
            <Button variant="ghost" size="sm" className="gap-2" onClick={sair}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const ativo = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    ativo && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
