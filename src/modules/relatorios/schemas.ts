import { z } from "zod"

export const periodoSchema = z
  .object({
    periodo_inicio: z.string().min(1, "Informe o início do período"),
    periodo_fim: z.string().min(1, "Informe o fim do período"),
  })
  .refine((dados) => dados.periodo_inicio <= dados.periodo_fim, {
    message: "O período final deve ser depois do início",
    path: ["periodo_fim"],
  })
export type PeriodoFormValues = z.infer<typeof periodoSchema>
