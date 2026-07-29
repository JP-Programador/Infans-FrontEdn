import { z } from "zod"

export const planejamentoSchema = z
  .object({
    titulo: z.string().min(1, "Informe um título"),
    escola_id: z.string().min(1, "Selecione a escola"),
    turma_id: z.string().min(1, "Selecione a turma"),
    data_inicio: z.string().min(1, "Informe a data inicial"),
    data_fim: z.string().min(1, "Informe a data final"),
  })
  .refine((dados) => dados.data_inicio <= dados.data_fim, {
    message: "A data final deve ser depois da data inicial",
    path: ["data_fim"],
  })
export type PlanejamentoFormValues = z.infer<typeof planejamentoSchema>
