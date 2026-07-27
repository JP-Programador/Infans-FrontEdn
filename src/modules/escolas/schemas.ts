import { z } from "zod"

export const escolaSchema = z.object({
  nome: z.string().min(1, "Informe o nome da escola"),
  cidade: z.string().optional(),
  estado: z
    .string()
    .max(2, "Use a sigla do estado (2 letras)")
    .optional(),
})
export type EscolaFormValues = z.infer<typeof escolaSchema>

export const escolaEditSchema = z.object({
  nome: z.string().min(1, "Informe o nome da escola"),
  cidade: z.string().optional(),
  estado: z.string().max(2, "Use a sigla do estado (2 letras)").optional(),
  ativa: z.boolean(),
})
export type EscolaEditFormValues = z.infer<typeof escolaEditSchema>

export const vincularProfessoraSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
})
export type VincularProfessoraFormValues = z.infer<typeof vincularProfessoraSchema>
