import { cn } from "@/lib/utils"

/** Container genérico de barra superior (branca) — o conteúdo é composto por quem
 * usa. Hoje usado pelo `Navbar`. */
export function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-navbar px-4 md:px-6",
        className
      )}
      {...props}
    />
  )
}
