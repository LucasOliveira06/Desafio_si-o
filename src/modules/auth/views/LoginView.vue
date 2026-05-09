<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Eye, EyeOff, LogIn, XCircle, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: 'admin@siao.com', password: '123456' })
const showPassword = ref(false)

const toast = ref<{ visible: boolean; message: string }>({ visible: false, message: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { visible: true, message }
  toastTimer = setTimeout(() => {
    toast.value.visible = false
  }, 4000)
}

function dismissToast() {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value.visible = false
}

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

async function handleLogin() {
  try {
    await authStore.login(form)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/')
  } catch {
    showToast(authStore.error ?? 'Credenciais inválidas. Tente novamente.')
  }
}
</script>

<template>
  <AuthLayout>
    <!-- Toast de erro de login -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toast.visible"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
      >
        <div class="flex items-start gap-3 rounded-xl bg-red-600 px-4 py-3 text-white shadow-lg ring-1 ring-red-700">
          <XCircle class="mt-0.5 h-5 w-5 shrink-0" />
          <p class="flex-1 text-sm font-medium leading-snug">{{ toast.message }}</p>
          <button
            type="button"
            @click="dismissToast"
            class="shrink-0 rounded p-0.5 hover:bg-red-500 transition-colors"
            aria-label="Fechar notificação"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>

    <div class="card p-8">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">Entrar no sistema</h2>
        <p class="text-sm text-gray-500 mt-1">Use as credenciais abaixo para acessar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="label-base">E-mail <span class="text-red-500">*</span></label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
            autocomplete="email"
            class="input-base"
          />
        </div>

        <div>
          <label class="label-base">Senha <span class="text-red-500">*</span></label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              class="input-base pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="btn-primary w-full justify-center py-2.5"
        >
          <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <LogIn v-else class="w-4 h-4" />
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-xs font-medium text-blue-700 mb-1">Credenciais de demo:</p>
        <p class="text-xs text-blue-600">E-mail: <code class="font-mono">admin@siao.com</code></p>
        <p class="text-xs text-blue-600">Senha: <code class="font-mono">123456</code></p>
      </div>
    </div>
  </AuthLayout>
</template>
