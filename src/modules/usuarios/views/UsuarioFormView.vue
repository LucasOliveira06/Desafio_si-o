<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useUsuarioStore } from '@/stores/usuario'
import { useCartorioStore } from '@/stores/cartorio'
import type { UsuarioCreate } from '@/types/usuario'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useUsuarioStore()
const cartorioStore = useCartorioStore()

const isEditing = computed(() => !!props.id)

const form = reactive<UsuarioCreate>({
  nome: '',
  cpf: '',
  email: '',
  password: '',
  telefone: '',
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
  cartorio_id: null,
})

const cartorioOptions = computed(() => [
  { value: '', label: 'Nenhum cartório' },
  ...cartorioStore.items.map((c) => ({ value: c.id, label: c.nome })),
])

onMounted(async () => {
  await cartorioStore.fetchAll({ per_page: 100 })
  if (isEditing.value && props.id) {
    await store.fetchOne(Number(props.id))
    if (store.current) {
      Object.assign(form, {
        nome: store.current.nome,
        cpf: store.current.cpf,
        email: store.current.email,
        telefone: store.current.telefone,
        endereco: store.current.endereco,
        cidade: store.current.cidade,
        estado: store.current.estado,
        cep: store.current.cep,
        cartorio_id: store.current.cartorio_id,
      })
    }
  }
})

async function handleSubmit() {
  try {
    if (isEditing.value && props.id) {
      const { password, ...rest } = form
      const payload = password ? { ...rest, password } : rest
      await store.update(Number(props.id), payload)
    } else {
      await store.create(form)
    }
    router.push('/usuarios')
  } catch {
    // error in store
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <button
        @click="router.push('/usuarios')"
        class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-semibold text-gray-800">
        {{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}
      </h1>
    </div>

    <div v-if="store.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ store.error }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Dados Pessoais
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.nome" label="Nome completo" required placeholder="Nome e sobrenome" />
          </div>
          <BaseInput v-model="form.cpf" label="CPF" required placeholder="000.000.000-00" />
          <BaseInput v-model="form.telefone" label="Telefone" placeholder="(00) 00000-0000" />
          <BaseInput v-model="form.email" label="E-mail" type="email" required placeholder="email@exemplo.com" />
          <div>
            <BaseInput
              v-model="form.password"
              :label="isEditing ? 'Nova senha' : 'Senha'"
              type="password"
              :required="!isEditing"
              :placeholder="isEditing ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'"
            />
            <p v-if="isEditing" class="mt-1 text-xs text-gray-400">
              Preencha apenas para alterar a senha do usuário.
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Endereço
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.endereco" label="Endereço completo" placeholder="Rua, número, bairro" />
          </div>
          <BaseInput v-model="form.cep" label="CEP" placeholder="00000-000" />
          <BaseInput v-model="form.cidade" label="Cidade" required placeholder="São Paulo" />
          <BaseInput v-model="form.estado" label="Estado (UF)" required placeholder="SP" />
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Vínculo
        </h2>
        <BaseSelect
          :model-value="form.cartorio_id != null ? String(form.cartorio_id) : ''"
          label="Cartório vinculado"
          :options="cartorioOptions"
          @update:model-value="(v) => (form.cartorio_id = v ? Number(v) : null)"
        />
      </div>

      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="router.push('/usuarios')">
          Cancelar
        </BaseButton>
        <BaseButton type="submit" :loading="store.loading">
          <Save class="w-4 h-4" />
          {{ isEditing ? 'Salvar alterações' : 'Criar usuário' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
