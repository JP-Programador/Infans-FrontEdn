"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MenuIcon, NotificationIcon, SearchIcon } from "@/design-system/icons"
import { obterIniciais } from "@/lib/utils"
import type { Escola } from "@/lib/types"

type NavbarProps = {
  professoraNome?: string
  escolas: Escola[]
  escolaAtualId?: string
  onSelecionarEscola?: (id: string) => void
  onAbrirMenuMobile?: () => void
}

/** Barra superior branca: busca, seletor de escola, notificações e avatar. */
export function Navbar({
  professoraNome,
  escolas,
  escolaAtualId,
  onSelecionarEscola,
  onAbrirMenuMobile,
}: NavbarProps) {
  return (
    <Header>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onAbrirMenuMobile}
        aria-label="Abrir menu"
      >
        <MenuIcon className="size-5" />
      </Button>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2 md:flex">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar crianças, turmas, escolas..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
        {escolas.length > 0 && (
          <Select value={escolaAtualId ?? ""} onValueChange={(valor) => valor && onSelecionarEscola?.(valor)}>
            <SelectTrigger className="hidden sm:flex">
              <SelectValue>
                {() => escolas.find((escola) => escola.id === escolaAtualId)?.nome ?? "Selecione a escola"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {escolas.map((escola) => (
                <SelectItem key={escola.id} value={escola.id}>
                  {escola.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button variant="ghost" size="icon" aria-label="Notificações">
          <NotificationIcon className="size-5" />
        </Button>

        <Avatar>
          <AvatarFallback>{professoraNome ? obterIniciais(professoraNome) : "?"}</AvatarFallback>
        </Avatar>
      </div>
    </Header>
  )
}
