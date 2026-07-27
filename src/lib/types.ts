export type Professora = {
  id: string
  nome: string
  email: string
  ativa: boolean
  created_at: string
}

export type Escola = {
  id: string
  nome: string
  cidade: string | null
  estado: string | null
  ativa: boolean
  created_at: string
}

export type Turma = {
  id: string
  escola_id: string
  nome: string
  ativa: boolean
}

export type Crianca = {
  id: string
  nome: string
  data_nascimento: string
  responsavel: string | null
  turma_id: string | null
  idade_anos: number
  idade_meses: number
}

export type RegistroPedagogico = {
  id: string
  crianca_id: string
  professora_id: string
  data: string
  texto: string
  created_at: string
  updated_at: string
}

export type Relatorio = {
  id: string
  crianca_id: string
  professora_id: string
  periodo_inicio: string
  periodo_fim: string
  texto_ia: string
  texto_final: string
  created_at: string
  updated_at: string
}

export type Configuracao = {
  dias_alerta_sem_registro: number
  nome_sistema: string
}

export type RegistroResumo = {
  crianca_id: string
  crianca_nome: string
  data: string
  texto: string
}

export type CriancaAlerta = {
  crianca_id: string
  nome: string
  dias_sem_registro: number | null
}

export type Dashboard = {
  quantidade_criancas: number
  quantidade_registros: number
  quantidade_relatorios: number
  ultimos_registros: RegistroResumo[]
  criancas_sem_registro_recente: CriancaAlerta[]
  ultimo_login: string | null
}
