import { z } from "zod"

export const configuracaoSchema = z.object({
  dias_alerta_sem_registro: z.number().int().min(1, "Mínimo de 1 dia").max(365, "Máximo de 365 dias"),
  nome_sistema: z.string().min(1, "Informe o nome do sistema"),
})
export type ConfiguracaoFormValues = z.infer<typeof configuracaoSchema>
