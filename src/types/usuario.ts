export interface Usuario {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  cartorio_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type UsuarioCreate = Omit<Usuario, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & {
  password: string
}
export type UsuarioUpdate = Partial<Omit<UsuarioCreate, 'password'>> & { password?: string }

export interface UsuarioFilters {
  search?: string
  estado?: string
  cartorio_id?: number
  page?: number
  per_page?: number
}

export type { PaginatedResponse } from '@/types/shared'
