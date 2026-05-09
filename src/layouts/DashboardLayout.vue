<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

const collapsed = ref(false)
const route = useRoute()

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/cartorios': 'Cartórios',
  '/imoveis': 'Imóveis',
  '/usuarios': 'Usuários',
}

function getTitle() {
  if (route.path.endsWith('/novo')) return 'Novo Registro'
  if (route.path.endsWith('/editar')) return 'Editar Registro'
  return pageTitles[route.path] ?? 'Desafio Sião'
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />

    <div class="flex flex-col flex-1 overflow-hidden">
      <Header>
        <template #title>
          <h1 class="text-lg font-semibold text-gray-800">{{ getTitle() }}</h1>
        </template>
      </Header>

      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
