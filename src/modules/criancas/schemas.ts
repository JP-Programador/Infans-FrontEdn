import { z } from "zod"

export const criancaSchema = z.object({
  nome: z.string().min(1, "Informe o nome da criança"),
  data_nascimento: z.string().min(1, "Informe a data de nascimento"),
  responsavel: z.string().optional(),
})
export type CriancaFormValues = z.infer<typeof criancaSchema>
