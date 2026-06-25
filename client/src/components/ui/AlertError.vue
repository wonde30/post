<script setup lang="ts">
defineProps<{ message: string; retryable?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    <span aria-hidden="true">⚠️</span>
    <div class="flex-1">
      <p>{{ message }}</p>
      <button
        v-if="retryable"
        type="button"
        class="mt-2 font-semibold underline underline-offset-2 hover:text-red-800"
        @click="$emit('retry')"
      >
        Try again
      </button>
    </div>
  </div>
</template>
