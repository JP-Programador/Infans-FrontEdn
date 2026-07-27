"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { trocarSenhaSchema, type TrocarSenhaFormValues } from "../schemas"

export function TrocarSenhaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { autenticar } = useAuth()

  const form = useForm<TrocarSenhaFormValues>({
    resolver: zodResolver(trocarSenhaSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      senha_atual: "",
      senha_nova: "",
    },
  })

  const mutation = useMutation({
    mutationFn: trocarSenha,
    onSuccess: async (dados) => {
      toast.success("Senha atualizada com sucesso!")
      await autenticar(dados.access_token)
      router.push("/dashboard")
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível trocar a senha.")
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@escola.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Trocar senha"}
        </Button>
      </form>
    </Form>
  )
}
