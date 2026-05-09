<script setup lang="ts" generic="T extends Record<string, unknown>">
import { Loader2, SearchX } from 'lucide-vue-next'

defineProps<{
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <slot name="head" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="100" class="py-16 text-center text-gray-400">
              <div class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" />
                <span>Carregando...</span>
              </div>
            </td>
          </tr>
          <template v-else>
            <slot name="body" />
            <tr v-if="!$slots.body">
              <td colspan="100" class="py-16 text-center text-gray-400">
                <div class="flex flex-col items-center gap-2">
                  <SearchX class="w-10 h-10 text-gray-300" />
                  <span>{{ emptyMessage ?? 'Nenhum registro encontrado.' }}</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>
