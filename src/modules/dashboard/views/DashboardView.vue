<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Building2, Home, Users, TrendingUp, ArrowRight } from 'lucide-vue-next'
import { useCartorioStore } from '@/stores/cartorio'
import { useImovelStore } from '@/stores/imovel'
import { useUsuarioStore } from '@/stores/usuario'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const cartorioStore = useCartorioStore()
const imovelStore = useImovelStore()
const usuarioStore = useUsuarioStore()

onMounted(async () => {
  await Promise.all([
    cartorioStore.fetchAll(),
    imovelStore.fetchAll(),
    usuarioStore.fetchAll(),
  ])
})

const totalValorAvaliado = computed(() =>
  imovelStore.items.reduce((sum, i) => sum + i.valor_avaliado, 0),
)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const cards = computed(() => [
  {
    label: 'Cartórios',
    value: cartorioStore.pagination.total,
    icon: Building2,
    color: 'bg-blue-500',
    bg: 'bg-blue-50',
    to: '/cartorios',
  },
  {
    label: 'Imóveis',
    value: imovelStore.pagination.total,
    icon: Home,
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    to: '/imoveis',
  },
  {
    label: 'Usuários',
    value: usuarioStore.pagination.total,
    icon: Users,
    color: 'bg-violet-500',
    bg: 'bg-violet-50',
    to: '/usuarios',
  },
  {
    label: 'Valor Total em Imóveis',
    value: formatCurrency(totalValorAvaliado.value),
    icon: TrendingUp,
    color: 'bg-amber-500',
    bg: 'bg-amber-50',
    to: '/imoveis',
  },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">
        Olá, {{ authStore.user?.nome?.split(' ')[0] }}! 👋
      </h2>
      <p class="text-gray-500 mt-1">Bem-vindo ao sistema de gestão Desafio Sião.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <RouterLink
        v-for="card in cards"
        :key="card.label"
        :to="card.to"
        class="card p-5 hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ card.label }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ card.value }}</p>
          </div>
          <div :class="['p-2.5 rounded-xl', card.bg]">
            <component :is="card.icon" :class="['w-6 h-6', card.color.replace('bg-', 'text-')]" />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-1 text-xs text-primary-600 font-medium group-hover:gap-2 transition-all">
          Ver detalhes <ArrowRight class="w-3.5 h-3.5" />
        </div>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Home class="w-4 h-4 text-emerald-500" />
          Últimos Imóveis Registrados
        </h3>
        <div class="space-y-3">
          <div
            v-for="imovel in imovelStore.items.slice(0, 5)"
            :key="imovel.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-800">{{ imovel.matricula }}</p>
              <p class="text-xs text-gray-500">{{ imovel.cidade }}, {{ imovel.estado }}</p>
            </div>
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full font-medium',
                imovel.status === 'ativo' ? 'bg-green-100 text-green-700' :
                imovel.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600',
              ]"
            >
              {{ imovel.status }}
            </span>
          </div>
        </div>
        <RouterLink to="/imoveis" class="mt-4 flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline">
          Ver todos os imóveis <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>

      <div class="card p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 class="w-4 h-4 text-blue-500" />
          Cartórios Cadastrados
        </h3>
        <div class="space-y-3">
          <div
            v-for="cartorio in cartorioStore.items.slice(0, 5)"
            :key="cartorio.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-800 line-clamp-1">{{ cartorio.nome }}</p>
              <p class="text-xs text-gray-500">{{ cartorio.cidade }}, {{ cartorio.estado }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ cartorio.responsavel_nome.split(' ')[0] }}</span>
          </div>
        </div>
        <RouterLink to="/cartorios" class="mt-4 flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline">
          Ver todos os cartórios <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
