"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RegistrosPorSemana } from "@/lib/types"
import { formatarDataBR } from "@/lib/utils"

export function RegistrosChart({ dados }: { dados: RegistrosPorSemana[] }) {
  const dadosFormatados = dados.map((item) => ({
    semana: formatarDataBR(item.semana_inicio).slice(0, 5),
    quantidade: item.quantidade,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registros por semana</CardTitle>
        <CardDescription>Últimas 8 semanas, com base nos registros salvos.</CardDescription>
      </CardHeader>
      <CardContent className="h-64 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosFormatados} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="semana"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                fontSize: 13,
              }}
            />
            <Bar dataKey="quantidade" name="Registros" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
