export type ImovelTipo = 'residencial' | 'comercial' | 'rural' | 'industrial' | 'outro'
export type ImovelStatus = 'ativo' | 'inativo' | 'pendente'

export interface Imovel {
  id: number
  matricula: string
  tipo: ImovelTipo
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  status: ImovelStatus
  proprietario_id: number
  proprietario_nome: string
  proprietario_cpf: string
  cartorio_id: number
  valor_avaliado: number
  area_total: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type ImovelCreate = Omit<Imovel, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
export type ImovelUpdate = Partial<ImovelCreate>

export interface ImovelFilters {
  search?: string
  tipo?: ImovelTipo
  status?: ImovelStatus
  estado?: string
  cartorio_id?: number
  page?: number
  per_page?: number
}

export type { PaginatedResponse } from '@/types/shared'
