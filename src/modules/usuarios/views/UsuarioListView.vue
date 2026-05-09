<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import { useUsuarioStore } from '@/stores/usuario'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Pagination from '@/components/ui/Pagination.vue'

const store = useUsuarioStore()
const router = useRouter()

const search = ref('')
const page = ref(1)
const deleteTarget = ref<number | null>(null)

async function load() {
  await store.fetchAll({ search: search.value || undefined, page: page.value })
}

onMounted(load)
watch([search], () => { page.value = 1; load() })

async function confirmDelete() {
  if (!deleteTarget.value) return
  await store.remove(deleteTarget.value)
  deleteTarget.value = null
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
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
          placeholder="Buscar por nome, e-mail ou CPF..."
          class="input-base pl-9"
        />
      </div>
      <BaseButton @click="router.push('/usuarios/novo')">
        <Plus class="w-4 h-4" /> Novo Usuário
      </BaseButton>
    </div>

    <BaseTable :loading="store.loading" empty-message="Nenhum usuário encontrado.">
      <template #head>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuário</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">CPF</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contato</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Localização</th>
        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cartório</th>
        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
      </template>
      <template #body>
        <tr
          v-for="usuario in store.items"
          :key="usuario.id"
          class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {{ getInitials(usuario.nome) }}
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">{{ usuario.nome }}</p>
                <p class="text-xs text-gray-400">{{ usuario.email }}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-sm font-mono text-gray-600">{{ usuario.cpf }}</td>
          <td class="px-4 py-3">
            <p class="text-sm text-gray-600">{{ usuario.email }}</p>
            <p class="text-xs text-gray-400">{{ usuario.telefone }}</p>
          </td>
          <td class="px-4 py-3 text-sm text-gray-600">{{ usuario.cidade }}/{{ usuario.estado }}</td>
          <td class="px-4 py-3">
            <span v-if="usuario.cartorio_id" class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              ID #{{ usuario.cartorio_id }}
            </span>
            <span v-else class="text-xs text-gray-400">—</span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="router.push(`/usuarios/${usuario.id}/editar`)"
                class="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click="deleteTarget = usuario.id"
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
      <p class="text-sm text-gray-600">Tem certeza que deseja excluir este usuário?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="deleteTarget = null">Cancelar</BaseButton>
        <BaseButton variant="danger" :loading="store.loading" @click="confirmDelete">Excluir</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
