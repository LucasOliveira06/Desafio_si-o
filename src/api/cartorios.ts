import apiClient from './axios'
import type { Cartorio, CartorioCreate, CartorioUpdate, CartorioFilters, PaginatedResponse } from '@/types/cartorio'

type ApiResponse<T> = { success: true; data: T }

export async function getCartorios(filters: CartorioFilters = {}): Promise<PaginatedResponse<Cartorio>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Cartorio>>>('/cartorios', { params: filters })
  return data.data
}

export async function getCartorio(id: number): Promise<Cartorio> {
  const { data } = await apiClient.get<ApiResponse<Cartorio>>(`/cartorios/${id}`)
  return data.data
}

export async function createCartorio(payload: CartorioCreate): Promise<Cartorio> {
  const { data } = await apiClient.post<ApiResponse<Cartorio>>('/cartorios', payload)
  return data.data
}

export async function updateCartorio(id: number, payload: CartorioUpdate): Promise<Cartorio> {
  const { data } = await apiClient.patch<ApiResponse<Cartorio>>(`/cartorios/${id}`, payload)
  return data.data
}

export async function deleteCartorio(id: number): Promise<void> {
  await apiClient.delete(`/cartorios/${id}`)
}
