<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '@/types'
import { api, getToken, getErrorMessage } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/format'
import SpinnerBlock from '@/components/ui/SpinnerBlock.vue'
import AlertError from '@/components/ui/AlertError.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const id = Number(route.params.id)
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

const confirming = ref(false)
const deleting = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  try {
    // GET /posts/{id} via axios. The API wraps a single post in a `data` key
    // (Laravel's JsonResource), so the post itself is at `response.data.data`.
    post.value = await api.get<{ data: Post }>(`/posts/${id}`).then((r) => r.data.data)
  } catch (e) {
    error.value = getErrorMessage(e, 'Post not found')
  } finally {
    loading.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    // DELETE /posts/{id} with the built-in `fetch` instead of axios — we set the
    // URL, headers and bearer token by hand and check `res.ok` ourselves, since
    // fetch only rejects on a network error, not on a 4xx/5xx HTTP status.
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (!res.ok) throw new Error('Could not delete the post')

    router.push({ name: 'posts' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not delete the post'
    confirming.value = false
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'posts' }" class="text-sm text-slate-500 hover:text-emerald-700">
      ← Back to posts
    </RouterLink>

    <SpinnerBlock v-if="loading" />
    <AlertError v-else-if="error" :message="error" class="mt-4" />

    <article v-else-if="post" class="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <h1 class="text-2xl font-bold text-slate-900">{{ post.title }}</h1>
        <span
          class="flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
        >
          {{ post.published ? 'Published' : 'Draft' }}
        </span>
      </div>

      <p class="mt-1 text-sm text-slate-400">
        By {{ post.author || post.user?.name || 'Unknown' }} · {{ formatDate(post.created_at) }}
      </p>

      <div class="mt-5 leading-relaxed whitespace-pre-line text-slate-700">{{ post.body }}</div>

      <div
        v-if="auth.owns(post.user_id)"
        class="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4"
      >
        <RouterLink
          :to="{ name: 'post-edit', params: { id: post.id } }"
          class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Edit
        </RouterLink>
        <BaseButton variant="danger" @click="confirming = true">Delete</BaseButton>
      </div>
    </article>

    <ConfirmDialog
      :open="confirming"
      title="Delete post?"
      :message="`This will permanently delete “${post?.title}”.`"
      :loading="deleting"
      @cancel="confirming = false"
      @confirm="confirmDelete"
    />
  </section>
</template>
