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

export type RegistrosPorSemana = {
  semana_inicio: string
  quantidade: number
}

export type TurmaResumo = {
  turma_id: string
  turma_nome: string
  escola_nome: string
  quantidade_criancas: number
}

export type StatusPlanejamento = "rascunho" | "concluido"
export type RotuloTurma = "turma" | "agrupamento"

export type Planejamento = {
  id: string
  professora_id: string
  escola_id: string
  turma_id: string
  titulo: string
  data_inicio: string
  data_fim: string
  status: StatusPlanejamento
  rotulo_turma: RotuloTurma
  created_at: string
  updated_at: string
}

export type PlanejamentoCard = Planejamento & {
  escola_nome: string
  turma_nome: string
  quantidade_dias: number
  quantidade_dias_preenchidos: number
}

export type PlanejamentoDetalhe = PlanejamentoCard & {
  quantidade_objetivos: number
  materiais_citados: string[]
}

export type PlanejamentoItem = {
  id: string
  planejamento_id: string
  data: string
  objetivo_aprendizagem: string
  atividade_titulo: string
  atividade_descricao: string
  materiais: string
  organizacao_tempo_espaco: string
  ordem: number
}

export type PlanejamentoVisualizacaoLinha = {
  data: string
  objetivo_aprendizagem: string
  atividade_titulo: string
  atividade_descricao: string
  materiais: string
  organizacao_tempo_espaco: string
}

export type PlanejamentoVisualizacao = {
  titulo: string
  turma_nome: string
  rotulo_turma: RotuloTurma
  professora_nome: string
  data_inicio: string
  data_fim: string
  status: StatusPlanejamento
  linhas: PlanejamentoVisualizacaoLinha[]
}

export type Dashboard = {
  quantidade_criancas: number
  quantidade_registros: number
  quantidade_relatorios: number
  ultimos_registros: RegistroResumo[]
  criancas_sem_registro_recente: CriancaAlerta[]
  registros_por_semana: RegistrosPorSemana[]
  turmas: TurmaResumo[]
  ultimo_login: string | null
}
