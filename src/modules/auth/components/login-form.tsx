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

import { login } from "../api"
import { loginSchema, type LoginFormValues } from "../schemas"

export function LoginForm() {
  const router = useRouter()
  const { autenticar } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (dados) => {
      await autenticar(dados.access_token)
      router.push("/dashboard")
    },
    onError: (erro) => {
      if (erro instanceof ApiError && erro.errorCode === "PASSWORD_EXPIRED") {
        toast.warning("Sua senha expirou. Defina uma nova senha para continuar.")
        router.push(`/trocar-senha?email=${encodeURIComponent(form.getValues("email"))}`)
        return
      }
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível entrar.")
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
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}
