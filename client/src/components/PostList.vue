<script setup lang="ts">
import type { Post } from '@/types'
import PostCard from './PostCard.vue'
import PaginationBar from './PaginationBar.vue'
import SpinnerBlock from './ui/SpinnerBlock.vue'
import AlertError from './ui/AlertError.vue'
import EmptyState from './ui/EmptyState.vue'

defineProps<{
  posts: Post[]
  loading: boolean
  error: string
  currentPage: number
  lastPage: number
  emptyTitle: string
  emptySubtitle?: string
}>()

defineEmits<{ retry: []; delete: [post: Post]; change: [page: number] }>()
</script>

<template>
  <SpinnerBlock v-if="loading && posts.length === 0" />

  <AlertError v-else-if="error" :message="error" retryable @retry="$emit('retry')" />

  <EmptyState v-else-if="posts.length === 0" :title="emptyTitle" :subtitle="emptySubtitle">
    <slot name="empty-action" />
  </EmptyState>

  <div v-else class="space-y-4">
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @delete="$emit('delete', $event)"
    />
    <PaginationBar
      :current-page="currentPage"
      :last-page="lastPage"
      @change="$emit('change', $event)"
    />
  </div>
</template>
