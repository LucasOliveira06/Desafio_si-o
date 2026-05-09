<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

defineProps<{ collapsed: boolean }>()
defineEmits<{ (e: 'toggle'): void }>()

const route = useRoute()

const navItems = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard, exact: true },
  { name: 'Cartórios', to: '/cartorios', icon: Building2, exact: false },
  { name: 'Imóveis', to: '/imoveis', icon: Home, exact: false },
  { name: 'Usuários', to: '/usuarios', icon: Users, exact: false },
]

function isActive(item: { to: string; exact: boolean }) {
  return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}
</script>

<template>
  <aside
    :class="[
      'relative flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out flex-shrink-0',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <div class="flex items-center h-16 px-4 border-b border-gray-700">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Building2 class="w-5 h-5 text-white" />
        </div>
        <span
          :class="['font-bold text-sm whitespace-nowrap transition-all duration-300', collapsed ? 'opacity-0 w-0' : 'opacity-100']"
        >
          Desafio Sião
        </span>
      </div>
    </div>

    <nav class="flex-1 py-4 space-y-1 px-2 overflow-hidden">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive(item)
            ? 'bg-primary-600 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span :class="['whitespace-nowrap transition-all duration-300', collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100']">
          {{ item.name }}
        </span>
      </RouterLink>
    </nav>

    <button
      @click="$emit('toggle')"
      class="absolute -right-3 top-20 w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors z-10"
    >
      <ChevronLeft v-if="!collapsed" class="w-3.5 h-3.5 text-gray-300" />
      <ChevronRight v-else class="w-3.5 h-3.5 text-gray-300" />
    </button>
  </aside>
</template>
