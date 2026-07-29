"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Logo, LogoMark } from "@/components/ui/logo"
import { Navbar } from "@/components/ui/navbar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  type SidebarNavItem,
} from "@/components/ui/sidebar"
import {
  DashboardIcon,
  LogoutIcon,
  PlanningIcon,
  ReportIcon,
  SchoolIcon,
  SettingsIcon,
} from "@/design-system/icons"
import { obterIniciais } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { EscolaAtualProvider, useEscolaAtual } from "@/providers/escola-atual-provider"

const NAV_ITEMS: SidebarNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/escolas", label: "Escolas", icon: SchoolIcon },
  { href: "/planejamentos", label: "Planejamentos", icon: PlanningIcon },
  { href: "/relatorios", label: "Relatórios", icon: ReportIcon },
  { href: "/configuracoes", label: "Configurações", icon: SettingsIcon },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <EscolaAtualProvider>
      <AppShellContent>{children}</AppShellContent>
    </EscolaAtualProvider>
  )
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { professora, sair } = useAuth()
  const { escolas, escolaAtual, selecionarEscola } = useEscolaAtual()
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar>
        <SidebarHeader>
          <Logo className="h-9" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav items={NAV_ITEMS} />
        </SidebarContent>
        <SidebarFooter>
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
              {professora ? obterIniciais(professora.nome) : "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{professora?.nome}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {escolaAtual?.nome ?? "Nenhuma escola"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={sair}
          >
            <LogoutIcon className="size-4" />
            Sair
          </Button>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <Navbar
          professoraNome={professora?.nome}
          escolas={escolas}
          escolaAtualId={escolaAtual?.id}
          onSelecionarEscola={selecionarEscola}
          onAbrirMenuMobile={() => setMenuMobileAberto((aberto) => !aberto)}
        />

        {menuMobileAberto && (
          <div className="border-b border-border bg-sidebar px-4 py-3 md:hidden">
            <div className="mb-3">
              <LogoMark className="size-8" />
            </div>
            <SidebarNav items={NAV_ITEMS} />
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
