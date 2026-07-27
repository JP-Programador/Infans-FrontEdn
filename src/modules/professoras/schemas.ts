import { z } from "zod"

export const dadosContaSchema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
  email: z.string().min(1, "Informe o email").email("Email inválido"),
})
export type DadosContaFormValues = z.infer<typeof dadosContaSchema>
