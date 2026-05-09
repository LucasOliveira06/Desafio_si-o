import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Cartorio, CartorioCreate, CartorioUpdate, CartorioFilters, PaginatedResponse } from '@/types/cartorio'
import * as api from '@/api/cartorios'

export const useCartorioStore = defineStore('cartorio', () => {
  const items = ref<Cartorio[]>([])
  const current = ref<Cartorio | null>(null)
  const pagination = ref<Omit<PaginatedResponse<Cartorio>, 'data'>>({
    total: 0,
    page: 1,
    per_page: 10,
    last_page: 1,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters: CartorioFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.getCartorios(filters)
      items.value = res.data
      pagination.value = { total: res.total, page: res.page, per_page: res.per_page, last_page: res.last_page }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar cartórios.'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: number) {
    loading.value = true
    error.value = null
    try {
      current.value = await api.getCartorio(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar cartório.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(data: CartorioCreate) {
    loading.value = true
    error.value = null
    try {
      const created = await api.createCartorio(data)
      items.value.unshift(created)
      pagination.value.total++
      return created
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar cartório.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: CartorioUpdate) {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateCartorio(id, data)
      const idx = items.value.findIndex((c) => c.id === id)
      if (idx !== -1) items.value[idx] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar cartório.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.deleteCartorio(id)
      items.value = items.value.filter((c) => c.id !== id)
      pagination.value.total--
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao excluir cartório.'
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
