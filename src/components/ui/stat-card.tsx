import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const TONE_CLASSES = {
  blue: "bg-support-blue-soft text-support-blue",
  green: "bg-support-green-soft text-support-green",
  purple: "bg-support-purple-soft text-support-purple",
  orange: "bg-support-orange-soft text-support-orange",
  yellow: "bg-support-yellow-soft text-support-yellow",
} as const

export type StatCardTone = keyof typeof TONE_CLASSES

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: LucideIcon
  label: string
  value: number
  tone?: StatCardTone
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", TONE_CLASSES[tone])}>
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
