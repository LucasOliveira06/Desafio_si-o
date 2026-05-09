<script setup lang="ts">
defineProps<{
  modelValue?: string | number | null
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="label-base">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <select
      :value="modelValue ?? ''"
      :required="required"
      :disabled="disabled"
      :class="['input-base', error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '']"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>
