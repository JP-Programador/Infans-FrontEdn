"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api-client"
import { useAuth } from "@/providers/auth-provider"

import { trocarSenha } from "../api"
import { alterarSenhaSchema, type AlterarSenhaFormValues } from "../schemas"

export function AlterarSenhaForm() {
  const { professora, autenticar } = useAuth()

  const form = useForm<AlterarSenhaFormValues>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: { senha_atual: "", senha_nova: "" },
  })

  const mutation = useMutation({
    mutationFn: (dados: AlterarSenhaFormValues) => trocarSenha({ email: professora!.email, ...dados }),
    onSuccess: async (resultado) => {
      toast.success("Senha alterada com sucesso!")
      form.reset()
      await autenticar(resultado.access_token)
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível alterar a senha.")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alterar senha</CardTitle>
        <CardDescription>Por segurança, a senha deve ser trocada a cada 90 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
            <FormField
              control={form.control}
              name="senha_atual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha_nova"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Alterar senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
