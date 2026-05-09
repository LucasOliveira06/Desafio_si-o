export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  nome: string
  email: string
  cartorio_id: number | null
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
