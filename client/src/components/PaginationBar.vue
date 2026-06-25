<script setup lang="ts">
defineProps<{ currentPage: number; lastPage: number }>()
defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div v-if="lastPage > 1" class="mt-8 flex items-center justify-center gap-3">
    <button
      type="button"
      :disabled="currentPage <= 1"
      class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      @click="$emit('change', currentPage - 1)"
    >
      ← Prev
    </button>
    <span class="text-sm text-slate-500">Page {{ currentPage }} of {{ lastPage }}</span>
    <button
      type="button"
      :disabled="currentPage >= lastPage"
      class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      @click="$emit('change', currentPage + 1)"
    >
      Next →
    </button>
  </div>
</template>
