<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, User, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function logout() {
  authStore.logout()
  router.push('/login')
}

function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
    <div>
      <slot name="title" />
    </div>

    <div class="relative" ref="dropdownRef">
      <button
        @click="dropdownOpen = !dropdownOpen"
        class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
      >
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <User class="w-4 h-4 text-white" />
        </div>
        <div class="text-left hidden sm:block">
          <p class="text-sm font-medium text-gray-800 leading-none">{{ authStore.user?.nome }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ authStore.user?.email }}</p>
        </div>
        <ChevronDown class="w-4 h-4 text-gray-500" />
      </button>

      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50"
        >
          <button
            @click="logout"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut class="w-4 h-4" />
            Sair do sistema
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>
