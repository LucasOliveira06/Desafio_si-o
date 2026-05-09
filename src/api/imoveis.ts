import apiClient from './axios'
import type { Imovel, ImovelCreate, ImovelUpdate, ImovelFilters, PaginatedResponse } from '@/types/imovel'

type ApiResponse<T> = { success: true; data: T }

export async function getImoveis(filters: ImovelFilters = {}): Promise<PaginatedResponse<Imovel>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Imovel>>>('/imoveis', { params: filters })
  return data.data
}

export async function getImovel(id: number): Promise<Imovel> {
  const { data } = await apiClient.get<ApiResponse<Imovel>>(`/imoveis/${id}`)
  return data.data
}

export async function createImovel(payload: ImovelCreate): Promise<Imovel> {
  const { data } = await apiClient.post<ApiResponse<Imovel>>('/imoveis', payload)
  return data.data
}

export async function updateImovel(id: number, payload: ImovelUpdate): Promise<Imovel> {
  const { data } = await apiClient.patch<ApiResponse<Imovel>>(`/imoveis/${id}`, payload)
  return data.data
}

export async function deleteImovel(id: number): Promise<void> {
  await apiClient.delete(`/imoveis/${id}`)
}
