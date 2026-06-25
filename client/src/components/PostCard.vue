<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/format'

const props = defineProps<{ post: Post }>()
defineEmits<{ delete: [post: Post] }>()

const auth = useAuthStore()
const isOwner = computed(() => auth.owns(props.post.user_id))

const byline = computed(() => props.post.author || props.post.user?.name || 'Unknown')
const excerpt = computed(() =>
  props.post.body.length > 160 ? props.post.body.slice(0, 160) + '…' : props.post.body,
)
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div class="flex items-start justify-between gap-3">
      <RouterLink
        :to="{ name: 'post', params: { id: post.id } }"
        class="text-lg font-semibold text-slate-900 hover:text-emerald-700"
      >
        {{ post.title }}
      </RouterLink>
      <span
        class="flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
      >
        {{ post.published ? 'Published' : 'Draft' }}
      </span>
    </div>

    <p class="mt-1 text-xs text-slate-400">By {{ byline }} · {{ formatDate(post.created_at) }}</p>

    <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ excerpt }}</p>

    <div class="mt-4 flex items-center gap-4 text-sm">
      <RouterLink
        :to="{ name: 'post', params: { id: post.id } }"
        class="font-medium text-emerald-700 hover:underline"
      >
        Read more
      </RouterLink>
      <template v-if="isOwner">
        <RouterLink
          :to="{ name: 'post-edit', params: { id: post.id } }"
          class="font-medium text-slate-500 hover:text-slate-800"
        >
          Edit
        </RouterLink>
        <button
          type="button"
          class="font-medium text-red-500 hover:text-red-700"
          @click="$emit('delete', post)"
        >
          Delete
        </button>
      </template>
    </div>
  </article>
</template>
