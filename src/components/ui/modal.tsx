"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ModalProps = {
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  footer?: ReactNode
  children: ReactNode
}

/**
 * Wrapper simplificado sobre `Dialog` para o caso comum de título + conteúdo +
 * rodapé, sem precisar importar as 5 peças do Dialog em telas simples. Para
 * composições mais livres (como os formulários de criar/editar já existentes),
 * use `Dialog`/`DialogContent`/... diretamente.
 */
export function Modal({ trigger, open, onOpenChange, title, description, footer, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
