import apiClient from './axios'
import type { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioFilters, PaginatedResponse } from '@/types/usuario'

type ApiResponse<T> = { success: true; data: T }

export async function getUsuarios(filters: UsuarioFilters = {}): Promise<PaginatedResponse<Usuario>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Usuario>>>('/usuarios', { params: filters })
  return data.data
}

export async function getUsuario(id: number): Promise<Usuario> {
  const { data } = await apiClient.get<ApiResponse<Usuario>>(`/usuarios/${id}`)
  return data.data
}

export async function createUsuario(payload: UsuarioCreate): Promise<Usuario> {
  const { data } = await apiClient.post<ApiResponse<Usuario>>('/usuarios', payload)
  return data.data
}

export async function updateUsuario(id: number, payload: UsuarioUpdate): Promise<Usuario> {
  const { data } = await apiClient.patch<ApiResponse<Usuario>>(`/usuarios/${id}`, payload)
  return data.data
}

export async function deleteUsuario(id: number): Promise<void> {
  await apiClient.delete(`/usuarios/${id}`)
}
