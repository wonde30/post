<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="mx-auto max-w-3xl px-4 py-8">
    <RouterView />
  </main>
</template>
