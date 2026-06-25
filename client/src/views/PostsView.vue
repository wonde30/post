<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Post, Paginated } from '@/types'
import { api, getToken } from '@/lib/http'
import { usePostList } from '@/composables/usePostList'
import { useAuthStore } from '@/stores/auth'
import PostList from '@/components/PostList.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import AlertError from '@/components/ui/AlertError.vue'

const auth = useAuthStore()

// GET /posts — public, paginated list. This call uses axios (our shared `api`
// instance from lib/http), which sets the base URL, JSON headers and auth token
// for us, and hands back the parsed JSON on `response.data`.
const { posts, currentPage, lastPage, loading, error, load, changePage, removeFromList } =
  usePostList((page) =>
    api.get<Paginated<Post>>('/posts', { params: { page } }).then((r) => r.data),
  )

const toDelete = ref<Post | null>(null)
const deleting = ref(false)
const actionError = ref('')

function askDelete(post: Post) {
  toDelete.value = post
  actionError.value = ''
}

async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    // DELETE /posts/{id} — written with the browser's built-in `fetch` instead of
    // axios, so you can see the difference. With fetch you build the full URL,
    // set the headers and bearer token yourself, and fetch does NOT throw on a
    // failed HTTP status — you have to check `res.ok` and throw on your own.
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${toDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (!res.ok) throw new Error('Could not delete the post')

    removeFromList(toDelete.value.id)
    toDelete.value = null
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Could not delete the post'
  } finally {
    deleting.value = false
  }
}

onMounted(() => load(1))
</script>

<template>
  <section>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Latest posts</h1>
      <p class="text-sm text-slate-500">Everything the community has published.</p>
    </div>

    <AlertError v-if="actionError" :message="actionError" class="mb-4" />

    <PostList
      :posts="posts"
      :loading="loading"
      :error="error"
      :current-page="currentPage"
      :last-page="lastPage"
      empty-title="No posts yet"
      empty-subtitle="Be the first to write something."
      @retry="load(currentPage)"
      @delete="askDelete"
      @change="changePage"
    >
      <template #empty-action>
        <RouterLink
          v-if="auth.isAuthenticated"
          :to="{ name: 'post-create' }"
          class="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Write a post
        </RouterLink>
        <RouterLink
          v-else
          :to="{ name: 'login' }"
          class="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Log in to post
        </RouterLink>
      </template>
    </PostList>

    <ConfirmDialog
      :open="toDelete !== null"
      title="Delete post?"
      :message="`This will permanently delete “${toDelete?.title}”.`"
      :loading="deleting"
      @cancel="toDelete = null"
      @confirm="confirmDelete"
    />
  </section>
</template>
