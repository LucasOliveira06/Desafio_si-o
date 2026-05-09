<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useImovelStore } from '@/stores/imovel'
import { useCartorioStore } from '@/stores/cartorio'
import type { ImovelCreate, ImovelTipo, ImovelStatus } from '@/types/imovel'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useImovelStore()
const cartorioStore = useCartorioStore()

const isEditing = computed(() => !!props.id)

const form = reactive<ImovelCreate>({
  matricula: '',
  tipo: 'residencial',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  status: 'ativo',
  proprietario_id: 0,
  proprietario_nome: '',
  proprietario_cpf: '',
  cartorio_id: 0,
  valor_avaliado: 0,
  area_total: 0,
})

const tipoOptions = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'outro', label: 'Outro' },
]

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'inativo', label: 'Inativo' },
]

const cartorioOptions = computed(() =>
  cartorioStore.items.map((c) => ({ value: c.id, label: c.nome })),
)

onMounted(async () => {
  await cartorioStore.fetchAll({ per_page: 100 })
  if (isEditing.value && props.id) {
    await store.fetchOne(Number(props.id))
    if (store.current) {
      const cur = store.current
      Object.assign(form, {
        matricula: cur.matricula,
        tipo: cur.tipo,
        logradouro: cur.logradouro ?? '',
        numero: cur.numero ?? '',
        bairro: cur.bairro ?? '',
        cidade: cur.cidade,
        estado: cur.estado,
        cep: cur.cep ?? '',
        status: cur.status,
        proprietario_id: cur.proprietario_id,
        proprietario_nome: cur.proprietario_nome,
        proprietario_cpf: cur.proprietario_cpf,
        cartorio_id: cur.cartorio_id,
        valor_avaliado: cur.valor_avaliado != null ? Number(cur.valor_avaliado) || 0 : 0,
        area_total: cur.area_total != null ? Number(cur.area_total) || 0 : 0,
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
    router.push('/imoveis')
  } catch {
    // error in store
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <button
        @click="router.push('/imoveis')"
        class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-semibold text-gray-800">
        {{ isEditing ? 'Editar Imóvel' : 'Novo Imóvel' }}
      </h1>
    </div>

    <div v-if="store.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ store.error }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="card p-6 space-y-4">
        <h2 class="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          Dados do Imóvel
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput v-model="form.matricula" label="Matrícula" required placeholder="MAT-001-2024" />
          <BaseSelect
            :model-value="form.tipo"
            label="Tipo"
            required
            :options="tipoOptions"
            @update:model-value="(v) => (form.tipo = v as ImovelTipo)"
          />
          <BaseSelect
            :model-value="String(form.cartorio_id)"
            label="Cartório vinculado"
            :options="cartorioOptions"
            placeholder="Selecione um cartório"
            @update:model-value="(v) => (form.cartorio_id = Number(v))"
          />
          <BaseSelect
            :model-value="form.status"
            label="Status"
            required
            :options="statusOptions"
            @update:model-value="(v) => (form.status = v as ImovelStatus)"
          />
          <BaseInput
            :model-value="(form.area_total ?? 0).toString()"
            label="Área Total (m²)"
            type="number"
            placeholder="0.00"
            @update:model-value="(v) => (form.area_total = v !== '' ? Number(v) || 0 : 0)"
          />
          <BaseInput
            :model-value="(form.valor_avaliado ?? 0).toString()"
            label="Valor Avaliado (R$)"
            type="number"
            placeholder="0.00"
            @update:model-value="(v) => (form.valor_avaliado = v !== '' ? Number(v) || 0 : 0)"
          />
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
          Proprietário
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <BaseInput v-model="form.proprietario_nome" label="Nome do Proprietário" required placeholder="Nome completo" />
          </div>
          <BaseInput v-model="form.proprietario_cpf" label="CPF / CNPJ" required placeholder="000.000.000-00" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" type="button" @click="router.push('/imoveis')">
          Cancelar
        </BaseButton>
        <BaseButton type="submit" :loading="store.loading">
          <Save class="w-4 h-4" />
          {{ isEditing ? 'Salvar alterações' : 'Criar imóvel' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
