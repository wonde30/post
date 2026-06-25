<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
    <p class="text-lg font-semibold text-slate-700">{{ title }}</p>
    <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
    <div class="mt-4 flex justify-center">
      <slot />
    </div>
  </div>
</template>
