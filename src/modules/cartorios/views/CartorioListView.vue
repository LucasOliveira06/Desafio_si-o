<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import { useCartorioStore } from '@/stores/cartorio'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Pagination from '@/components/ui/Pagination.vue'

const store = useCartorioStore()
const router = useRouter()

const search = ref('')
const page = ref(1)
const deleteTarget = ref<number | null>(null)

async function load() {
  await store.fetchAll({ search: search.value, page: page.value })
}

onMounted(load)

watch([search, page], () => {
  if (search.value) page.value = 1
  load()
})

async function confirmDelete() {
  if (!deleteTarget.value) return
  await store.remove(deleteTarget.value)
  deleteTarget.value = null
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Buscar por nome, CNPJ ou responsável..."
          class="input-base pl-9"
        />
      </div>
      <BaseButton @click="router.push('/cartorios/novo')">
        <Plus class="w-4 h-4" /> Novo Cartório
      </BaseButton>
    </div>

    <BaseTable :loading="store.loading" empty-message="Nenhum cartório encontrado.">
      <template #head>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">CNPJ</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Localização</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Responsável</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contato</th>
        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
      </template>
      <template #body>
        <tr
          v-for="cartorio in store.items"
          :key="cartorio.id"
          class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3">
            <p class="font-medium text-gray-800 text-sm line-clamp-1 max-w-[220px]">{{ cartorio.nome }}</p>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ cartorio.cnpj }}</td>
          <td class="px-4 py-3 text-sm text-gray-600">{{ cartorio.cidade }}, {{ cartorio.estado }}</td>
          <td class="px-4 py-3">
            <p class="text-sm text-gray-800">{{ cartorio.responsavel_nome }}</p>
            <p class="text-xs text-gray-400 font-mono">{{ cartorio.responsavel_cpf }}</p>
          </td>
          <td class="px-4 py-3">
            <p class="text-sm text-gray-600">{{ cartorio.email }}</p>
            <p class="text-xs text-gray-400">{{ cartorio.telefone }}</p>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="router.push(`/cartorios/${cartorio.id}/editar`)"
                class="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click="deleteTarget = cartorio.id"
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
      <p class="text-sm text-gray-600">Tem certeza que deseja excluir este cartório? Esta ação não pode ser desfeita.</p>
      <template #footer>
        <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
        <BaseButton variant="danger" :loading="store.loading" @click="confirmDelete">Excluir</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
