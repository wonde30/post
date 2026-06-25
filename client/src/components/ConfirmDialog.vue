<script setup lang="ts">
import BaseButton from './ui/BaseButton.vue'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40" @click="$emit('cancel')" />
      <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-2">
          <BaseButton variant="ghost" @click="$emit('cancel')">Cancel</BaseButton>
          <BaseButton variant="danger" :loading="loading" @click="$emit('confirm')">
            {{ confirmLabel ?? 'Delete' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
