import apiClient from './axios'
import type { LoginCredentials, AuthResponse, AuthUser } from '@/types/auth'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<{ success: true; data: AuthResponse }>('/auth/login', credentials)
  return data.data
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ success: true; data: AuthUser }>('/auth/me')
  return data.data
}
