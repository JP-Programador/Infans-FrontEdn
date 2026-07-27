import { z } from "zod"

export const turmaSchema = z.object({
  nome: z.string().min(1, "Informe o nome da turma"),
})
export type TurmaFormValues = z.infer<typeof turmaSchema>

export const turmaEditSchema = z.object({
  nome: z.string().min(1, "Informe o nome da turma"),
  ativa: z.boolean(),
})
export type TurmaEditFormValues = z.infer<typeof turmaEditSchema>
