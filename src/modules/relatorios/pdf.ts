import { jsPDF } from "jspdf"

import type { StatusEvolutivo } from "./api"

const STATUS_LABEL: Record<StatusEvolutivo, string> = {
  progressao: "Progressão observada",
  manutencao: "Manutenção observada",
  insuficiente: "Evidências insuficientes",
}

async function carregarLogoBase64(): Promise<string | null> {
  try {
    const resposta = await fetch("/logo-infans-compacto.png")
    const blob = await resposta.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function exportarRelatorioPdf(dados: {
  criancaNome: string
  turmaNome: string | null
  dataInicio: string
  dataFim: string
  statusEvolutivo: StatusEvolutivo | null
  texto: string
  professoraNome: string
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const margem = 18
  const largura = doc.internal.pageSize.getWidth() - margem * 2
  let y = margem

  const logo = await carregarLogoBase64()
  if (logo) {
    doc.addImage(logo, "PNG", margem, y, 40, 40 * (333 / 900))
    y += 40 * (333 / 900) + 8
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(dados.criancaNome, margem, y)
  y += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(90)
  const linhaInfo = [
    dados.turmaNome ? `Turma: ${dados.turmaNome}` : null,
    `Período: ${formatarDataBR(dados.dataInicio)} até ${formatarDataBR(dados.dataFim)}`,
  ]
    .filter(Boolean)
    .join("  ·  ")
  doc.text(linhaInfo, margem, y)
  y += 6

  if (dados.statusEvolutivo) {
    doc.setFont("helvetica", "bold")
    doc.text(STATUS_LABEL[dados.statusEvolutivo], margem, y)
    y += 8
  } else {
    y += 2
  }

  doc.setDrawColor(220)
  doc.line(margem, y, margem + largura, y)
  y += 8

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.setTextColor(30)
  const linhasTexto = doc.splitTextToSize(dados.texto, largura)
  for (const linha of linhasTexto) {
    if (y > doc.internal.pageSize.getHeight() - margem - 20) {
      doc.addPage()
      y = margem
    }
    doc.text(linha, margem, y)
    y += 5.5
  }

  const alturaPagina = doc.internal.pageSize.getHeight()
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    `Professora: ${dados.professoraNome}  ·  Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
    margem,
    alturaPagina - margem / 2
  )

  doc.save(`relatorio-${normalizarNomeArquivo(dados.criancaNome)}.pdf`)
}

function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-")
  return `${dia}/${mes}/${ano}`
}

function normalizarNomeArquivo(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
}
