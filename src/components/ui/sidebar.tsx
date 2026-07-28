"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex",
        className
      )}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("px-6 py-7", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex-1 space-y-1 px-4", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-sidebar-border p-4", className)}
      {...props}
    />
  )
}

export type SidebarNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

/** Navegação principal da sidebar — item ativo destacado com fundo e barra lateral. */
export function SidebarNav({ items, className }: { items: SidebarNavItem[]; className?: string }) {
  const pathname = usePathname()

  return (
    <nav data-slot="sidebar-nav" className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const Icon = item.icon
        const ativo = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-150",
              "hover:bg-sidebar-accent hover:text-sidebar-foreground",
              ativo && "bg-sidebar-active text-sidebar-active-foreground shadow-sm"
            )}
          >
            {ativo && (
              <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-sidebar-primary" />
            )}
            <Icon className={cn("size-5 shrink-0 transition-colors", ativo && "text-sidebar-primary")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
