"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DownloadIcon, ExcelIcon } from "@/design-system/icons"

import { exportarPlanejamentoExcel, exportarPlanejamentoPdf } from "../api"

export function ExportButtons({ planejamentoId }: { planejamentoId: string }) {
  const [exportando, setExportando] = useState<"pdf" | "excel" | null>(null)

  async function exportar(tipo: "pdf" | "excel") {
    setExportando(tipo)
    try {
      if (tipo === "pdf") await exportarPlanejamentoPdf(planejamentoId)
      else await exportarPlanejamentoExcel(planejamentoId)
    } catch {
      toast.error("Não foi possível exportar o arquivo.")
    } finally {
      setExportando(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="gap-2"
        disabled={exportando === "pdf"}
        onClick={() => exportar("pdf")}
      >
        <DownloadIcon className="size-4" />
        {exportando === "pdf" ? "Exportando..." : "Exportar PDF"}
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        disabled={exportando === "excel"}
        onClick={() => exportar("excel")}
      >
        <ExcelIcon className="size-4" />
        {exportando === "excel" ? "Exportando..." : "Exportar Excel"}
      </Button>
    </div>
  )
}
