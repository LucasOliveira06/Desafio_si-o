import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioFilters, PaginatedResponse } from '@/types/usuario'
import * as api from '@/api/usuarios'

export const useUsuarioStore = defineStore('usuario', () => {
  const items = ref<Usuario[]>([])
  const current = ref<Usuario | null>(null)
  const pagination = ref<Omit<PaginatedResponse<Usuario>, 'data'>>({
    total: 0,
    page: 1,
    per_page: 10,
    last_page: 1,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters: UsuarioFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.getUsuarios(filters)
      items.value = res.data
      pagination.value = { total: res.total, page: res.page, per_page: res.per_page, last_page: res.last_page }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar usuários.'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: number) {
    loading.value = true
    error.value = null
    try {
      current.value = await api.getUsuario(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(data: UsuarioCreate) {
    loading.value = true
    error.value = null
    try {
      const created = await api.createUsuario(data)
      items.value.unshift(created)
      pagination.value.total++
      return created
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: UsuarioUpdate) {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateUsuario(id, data)
      const idx = items.value.findIndex((u) => u.id === id)
      if (idx !== -1) items.value[idx] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.deleteUsuario(id)
      items.value = items.value.filter((u) => u.id !== id)
      pagination.value.total--
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao excluir usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return { items, current, pagination, loading, error, fetchAll, fetchOne, create, update, remove, clearError }
})
