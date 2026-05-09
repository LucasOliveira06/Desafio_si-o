<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import { useImovelStore } from '@/stores/imovel'
import type { ImovelStatus, ImovelTipo } from '@/types/imovel'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import Pagination from '@/components/ui/Pagination.vue'

const store = useImovelStore()
const router = useRouter()

const search = ref('')
const filterStatus = ref<ImovelStatus | ''>('')
const filterTipo = ref<ImovelTipo | ''>('')
const page = ref(1)
const deleteTarget = ref<number | null>(null)

async function load() {
  await store.fetchAll({
    search: search.value || undefined,
    status: filterStatus.value || undefined,
    tipo: filterTipo.value || undefined,
    page: page.value,
  })
}

onMounted(load)
watch([search, filterStatus, filterTipo], () => { page.value = 1; load() })

async function confirmDelete() {
  if (!deleteTarget.value) return
  await store.remove(deleteTarget.value)
  deleteTarget.value = null
}

const statusMap: Record<ImovelStatus, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  ativo: { label: 'Ativo', variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  inativo: { label: 'Inativo', variant: 'neutral' },
}

const tipoLabels: Record<ImovelTipo, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  rural: 'Rural',
  industrial: 'Industrial',
  outro: 'Outro',
}

function formatCurrency(value: number | string | null | undefined) {
  const num = Number(value)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    isNaN(num) ? 0 : num,
  )
}

function formatArea(value: number | string | null | undefined) {
  const num = Number(value)
  return isNaN(num) ? '0' : num.toLocaleString('pt-BR')
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-1 flex-wrap">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="search"
            type="search"
            placeholder="Buscar por matrícula, proprietário..."
            class="input-base pl-9"
          />
        </div>
        <select v-model="filterStatus" class="input-base w-auto">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="pendente">Pendente</option>
          <option value="inativo">Inativo</option>
        </select>
        <select v-model="filterTipo" class="input-base w-auto">
          <option value="">Todos os tipos</option>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="rural">Rural</option>
          <option value="industrial">Industrial</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      <BaseButton @click="router.push('/imoveis/novo')">
        <Plus class="w-4 h-4" /> Novo Imóvel
      </BaseButton>
    </div>

    <BaseTable :loading="store.loading" empty-message="Nenhum imóvel encontrado.">
      <template #head>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Matrícula</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Localização</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Proprietário</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Área / Valor</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
      </template>
      <template #body>
        <tr
          v-for="imovel in store.items"
          :key="imovel.id"
          class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3 font-mono text-sm text-primary-700 font-medium">{{ imovel.matricula }}</td>
          <td class="px-4 py-3 text-sm text-gray-600">{{ tipoLabels[imovel.tipo] }}</td>
          <td class="px-4 py-3 text-sm text-gray-600">
            <p>{{ imovel.logradouro }}, {{ imovel.numero }}</p>
            <p class="text-xs text-gray-400">{{ imovel.cidade }}/{{ imovel.estado }}</p>
          </td>
          <td class="px-4 py-3">
            <p class="text-sm text-gray-800">{{ imovel.proprietario_nome }}</p>
            <p class="text-xs text-gray-400 font-mono">{{ imovel.proprietario_cpf }}</p>
          </td>
          <td class="px-4 py-3 text-sm">
            <p class="text-gray-800 font-medium">{{ formatCurrency(imovel.valor_avaliado) }}</p>
            <p class="text-xs text-gray-400">{{ formatArea(imovel.area_total) }} m²</p>
          </td>
          <td class="px-4 py-3">
            <BaseBadge :variant="statusMap[imovel.status].variant">
              {{ statusMap[imovel.status].label }}
            </BaseBadge>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="router.push(`/imoveis/${imovel.id}/editar`)"
                class="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click="deleteTarget = imovel.id"
                class="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Excluir"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template v-if="store.items.length" #footer>
        <Pagination
          :page="store.pagination.page"
          :last-page="store.pagination.last_page"
          :total="store.pagination.total"
          :per-page="store.pagination.per_page"
          @update:page="(p) => { page = p; load() }"
        />
      </template>
    </BaseTable>

    <BaseModal :open="!!deleteTarget" title="Confirmar exclusão" size="sm" @close="deleteTarget = null">
      <p class="text-sm text-gray-600">Tem certeza que deseja excluir este imóvel?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
        <BaseButton variant="danger" :loading="store.loading" @click="confirmDelete">Excluir</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
