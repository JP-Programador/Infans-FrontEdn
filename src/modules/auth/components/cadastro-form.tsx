"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

import { login, registrar } from "../api"
import { cadastroSchema, type CadastroFormValues } from "../schemas"

export function CadastroForm() {
  const router = useRouter()
  const { autenticar } = useAuth()

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  })

  const mutation = useMutation({
    mutationFn: registrar,
    onSuccess: async (_professora, variaveis) => {
      toast.success("Cadastro realizado!")
      try {
        const resultadoLogin = await login({ email: variaveis.email, senha: variaveis.senha })
        await autenticar(resultadoLogin.access_token)
        router.push("/dashboard")
      } catch {
        toast.info("Cadastro concluído. Faça login para continuar.")
        router.push("/login")
      }
    },
    onError: (erro) => {
      if (erro instanceof ApiError && erro.errorCode === "EMAIL_EXISTS") {
        toast.error("Já existe uma professora cadastrada com este email.")
        return
      }
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível cadastrar.")
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((dados) => mutation.mutate(dados))} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Cadastrando..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  )
}
