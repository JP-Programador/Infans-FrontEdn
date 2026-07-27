"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/providers/auth-provider"

export default function Home() {
  const { professora, carregando } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (carregando) return
    router.replace(professora ? "/dashboard" : "/login")
  }, [carregando, professora, router])

  return null
}
