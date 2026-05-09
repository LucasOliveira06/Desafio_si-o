<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      variant === 'danger' ? 'btn-danger' :
      variant === 'secondary' ? 'btn-secondary' :
      'btn-primary',
    ]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <slot />
  </button>
</template>
