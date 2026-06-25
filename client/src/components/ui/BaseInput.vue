<script setup lang="ts">
defineProps<{
  label: string
  id: string
  type?: string
  placeholder?: string
  error?: string
  autocomplete?: string
}>()

// defineModel() gives a writable ref wired to the parent's v-model.
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-slate-700">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2"
      :class="
        error
          ? 'border-red-400 focus:ring-red-200'
          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200'
      "
    />
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
