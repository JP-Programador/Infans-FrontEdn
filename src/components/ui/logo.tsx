import { cn } from "@/lib/utils"

/** Símbolo do Infans (círculo + pétalas azul/verde) — arquivo oficial, não alterar. */
export function LogoMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ícone estático simples, sem necessidade de otimização do next/image
  return <img src="/logo-icone.png" alt="" className={cn("h-8 w-auto object-contain", className)} />
}

/** Logotipo oficial do Infans (ícone + nome, com tagline opcional) — arquivo oficial, não alterar. */
export function Logo({
  className,
  showTagline = false,
}: {
  className?: string
  showTagline?: boolean
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- logo estático simples, sem necessidade de otimização do next/image
    <img
      src={showTagline ? "/logo-infans.png" : "/logo-infans-compacto.png"}
      alt="Infans — Gestão pedagógica que acompanha cada descoberta."
      className={cn("h-9 w-auto object-contain", className)}
    />
  )
}
