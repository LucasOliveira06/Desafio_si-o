<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  lastPage: number
  total: number
  perPage: number
}>()

const emit = defineEmits<{ (e: 'update:page', value: number): void }>()

const from = computed(() => (props.page - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.page * props.perPage, props.total))
</script>

<template>
  <div class="flex items-center justify-between text-sm text-gray-600">
    <span>
      Mostrando <strong>{{ from }}</strong>–<strong>{{ to }}</strong>
      de <strong>{{ total }}</strong> registros
    </span>
    <div class="flex items-center gap-1">
      <button
        :disabled="page <= 1"
        class="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('update:page', page - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <span class="px-3 py-1 rounded-lg bg-primary-600 text-white font-medium text-xs">
        {{ page }}
      </span>
      <button
        :disabled="page >= lastPage"
        class="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="emit('update:page', page + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
