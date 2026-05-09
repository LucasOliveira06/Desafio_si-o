export interface Cartorio {
  id: number
  nome: string
  cnpj: string
  telefone: string
  email: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  responsavel_id: number
  responsavel_nome: string
  responsavel_cpf: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CartorioCreate = Omit<Cartorio, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
export type CartorioUpdate = Partial<CartorioCreate>

export interface CartorioFilters {
  search?: string
  estado?: string
  page?: number
  per_page?: number
}

export type { PaginatedResponse } from '@/types/shared'
