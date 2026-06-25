<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Post, Paginated } from '@/types'
import { api, getToken } from '@/lib/http'
import { usePostList } from '@/composables/usePostList'
import PostList from '@/components/PostList.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import AlertError from '@/components/ui/AlertError.vue'

// GET /my-posts — auth-only list of the current user's posts, via axios.
const { posts, currentPage, lastPage, loading, error, load, changePage, removeFromList } =
  usePostList((page) =>
    api.get<Paginated<Post>>('/my-posts', { params: { page } }).then((r) => r.data),
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
    // DELETE /posts/{id} with the built-in `fetch` (no axios). Note how much we do
    // by hand: full URL, headers, bearer token, and the `res.ok` check — fetch
    // resolves even on a 4xx/5xx response, so it never throws for us.
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
      <h1 class="text-2xl font-bold text-slate-900">My posts</h1>
      <p class="text-sm text-slate-500">Posts you've written. Edit or delete any of them.</p>
    </div>

    <AlertError v-if="actionError" :message="actionError" class="mb-4" />

    <PostList
      :posts="posts"
      :loading="loading"
      :error="error"
      :current-page="currentPage"
      :last-page="lastPage"
      empty-title="You haven't written any posts yet"
      empty-subtitle="Create your first post to see it here."
      @retry="load(currentPage)"
      @delete="askDelete"
      @change="changePage"
    >
      <template #empty-action>
        <RouterLink
          :to="{ name: 'post-create' }"
          class="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Write a post
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
