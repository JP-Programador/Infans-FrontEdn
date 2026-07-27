"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api-client"

import { listarProfessorasDaEscola, vincularProfessora } from "../api"

export function ProfessorasDaEscola({ escolaId }: { escolaId: string }) {
  const [email, setEmail] = useState("")
  const queryClient = useQueryClient()

  const { data: professoras } = useQuery({
    queryKey: ["escolas", escolaId, "professoras"],
    queryFn: () => listarProfessorasDaEscola(escolaId),
  })

  const mutation = useMutation({
    mutationFn: () => vincularProfessora(escolaId, email),
    onSuccess: () => {
      toast.success("Professora vinculada com sucesso!")
      setEmail("")
      queryClient.invalidateQueries({ queryKey: ["escolas", escolaId, "professoras"] })
    },
    onError: (erro) => {
      toast.error(erro instanceof ApiError ? erro.message : "Não foi possível vincular a professora.")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Professoras</CardTitle>
        <CardDescription>Quem mais tem acesso a esta escola.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-1 text-sm">
          {professoras?.map((professora) => (
            <li
              key={professora.id}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
            >
              <span className="font-medium text-foreground">{professora.nome}</span>
              <span className="truncate text-muted-foreground">{professora.email}</span>
            </li>
          ))}
        </ul>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (email) mutation.mutate()
          }}
        >
          <Input
            type="email"
            placeholder="email@escola.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "..." : "Vincular"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
