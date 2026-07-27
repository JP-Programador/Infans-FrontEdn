import { z } from "zod"

export const registroSchema = z.object({
  data: z.string().min(1, "Informe a data"),
  texto: z.string().min(1, "Escreva o registro"),
})
export type RegistroFormValues = z.infer<typeof registroSchema>
