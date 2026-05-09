<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useCartorioStore } from '@/stores/cartorio'
import type { CartorioCreate } from '@/types/cartorio'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useCartorioStore()

const isEditing = computed(() => !!props.id)

const form = reactive<CartorioCreate>({
  nome: '',
  cnpj: '',
  telefone: '',
  email: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  responsavel_id: 0,
  responsavel_nome: '',
  responsavel_cpf: '',
})

onMounted(async () => {
  if (isEditing.value && props.id) {
    await store.fetchOne(Number(props.id))
    if (store.current) {
      Object.assign(form, {
        nome: store.current.nome,
        cnpj: store.current.cnpj,
        telefone: store.current.telefone,
        email: store.current.email,
        logradouro: store.current.logradouro,
        numero: store.current.numero,
        bairro: store.current.bairro,
        cidade: store.current.cidade,
        estado: store.current.estado,
        cep: store.current.cep,
        responsavel_id: store.current.responsavel_id,
        responsavel_nome: store.current.responsavel_nome,
        responsavel_cpf: store.current.responsavel_cpf,
      })
    }
  }
})

async function handleSubmit() {
  try {
    if (isEditing.value && props.id) {
      await store.update(Number(props.id), form)
    } else {
      await store.create(form)
    }
    router.push('/cartorios')
  } catch {
    // error already in store
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <button
        @click="router.push('/cartorios')"
        class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-semibold text-gray-800">
        {{ isEditing ? 'Editar Cartório' : 'Novo Cartório' }}
      </h1>
    </div>

    <div v-if="store.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ store.error }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Dados do Cartório
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.nome" label="Nome do Cartório" required placeholder="Ex: 1º Cartório de Registro..." />
          </div>
          <BaseInput v-model="form.cnpj" label="CNPJ" required placeholder="00.000.000/0001-00" />
          <BaseInput v-model="form.telefone" label="Telefone" placeholder="(00) 0000-0000" />
          <div class="md:col-span-2">
            <BaseInput v-model="form.email" label="E-mail" type="email" placeholder="cartorio@email.com" />
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Endereço
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.logradouro" label="Logradouro" placeholder="Rua, Av., etc." />
          </div>
          <BaseInput v-model="form.numero" label="Número" placeholder="123" />
          <BaseInput v-model="form.bairro" label="Bairro" placeholder="Centro" />
          <BaseInput v-model="form.cidade" label="Cidade" required placeholder="São Paulo" />
          <BaseInput v-model="form.estado" label="Estado (UF)" required placeholder="SP" />
          <BaseInput v-model="form.cep" label="CEP" placeholder="00000-000" />
        </div>
      </div>

      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Responsável
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.responsavel_nome" label="Nome do Responsável" required placeholder="Nome completo" />
          </div>
          <BaseInput v-model="form.responsavel_cpf" label="CPF do Responsável" required placeholder="000.000.000-00" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="router.push('/cartorios')">
          Cancelar
        </BaseButton>
        <BaseButton type="submit" :loading="store.loading">
          <Save class="w-4 h-4" />
          {{ isEditing ? 'Salvar alterações' : 'Criar cartório' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
