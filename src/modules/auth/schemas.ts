import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  senha: z.string().min(1, "Informe a senha"),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const cadastroSchema = z.object({
  nome: z.string().min(1, "Informe seu nome"),
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
})
export type CadastroFormValues = z.infer<typeof cadastroSchema>

export const trocarSenhaSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  senha_atual: z.string().min(1, "Informe a senha atual"),
  senha_nova: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
})
export type TrocarSenhaFormValues = z.infer<typeof trocarSenhaSchema>

export const alterarSenhaSchema = z.object({
  senha_atual: z.string().min(1, "Informe a senha atual"),
  senha_nova: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
})
export type AlterarSenhaFormValues = z.infer<typeof alterarSenhaSchema>
