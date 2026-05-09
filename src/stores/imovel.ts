import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Imovel, ImovelCreate, ImovelUpdate, ImovelFilters, PaginatedResponse } from '@/types/imovel'
import * as api from '@/api/imoveis'

function normalizeImovel(raw: Imovel): Imovel {
  return {
    ...raw,
    valor_avaliado: raw.valor_avaliado != null ? (Number(raw.valor_avaliado) || 0) : 0,
    area_total: raw.area_total != null ? (Number(raw.area_total) || 0) : 0,
  }
}

export const useImovelStore = defineStore('imovel', () => {
  const items = ref<Imovel[]>([])
  const current = ref<Imovel | null>(null)
  const pagination = ref<Omit<PaginatedResponse<Imovel>, 'data'>>({
    total: 0,
    page: 1,
    per_page: 10,
    last_page: 1,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters: ImovelFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.getImoveis(filters)
      items.value = res.data.map(normalizeImovel)
      pagination.value = { total: res.total, page: res.page, per_page: res.per_page, last_page: res.last_page }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar imóveis.'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: number) {
    loading.value = true
    error.value = null
    try {
      current.value = normalizeImovel(await api.getImovel(id))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar imóvel.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(data: ImovelCreate) {
    loading.value = true
    error.value = null
    try {
      const created = normalizeImovel(await api.createImovel(data))
      items.value.unshift(created)
      pagination.value.total++
      return created
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar imóvel.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: ImovelUpdate) {
    loading.value = true
    error.value = null
    try {
      const updated = normalizeImovel(await api.updateImovel(id, data))
      const idx = items.value.findIndex((i) => i.id === id)
      if (idx !== -1) items.value[idx] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar imóvel.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.deleteImovel(id)
      items.value = items.value.filter((i) => i.id !== id)
      pagination.value.total--
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao excluir imóvel.'
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
