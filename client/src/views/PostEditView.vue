<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '@/types'
import { api, getErrorMessage, getFieldErrors } from '@/lib/http'
import PostForm, { type PostInput } from '@/components/PostForm.vue'
import SpinnerBlock from '@/components/ui/SpinnerBlock.vue'
import AlertError from '@/components/ui/AlertError.vue'

const route = useRoute()
const router = useRouter()

const editingId = computed(() => (route.params.id ? Number(route.params.id) : null))
const isEdit = computed(() => editingId.value !== null)

const initial = ref<Post | null>(null)
const loading = ref(false)
const loadError = ref('')

const submitting = ref(false)
const serverErrors = ref<Record<string, string>>({})
const submitError = ref('')

async function loadForEdit() {
  if (!isEdit.value) return
  loading.value = true
  loadError.value = ''
  try {
    // GET /posts/{id} via axios (single post comes back wrapped in `data`).
    initial.value = await api
      .get<{ data: Post }>(`/posts/${editingId.value}`)
      .then((r) => r.data.data)
  } catch (e) {
    loadError.value = getErrorMessage(e, 'Could not load the post')
  } finally {
    loading.value = false
  }
}

async function onSubmit(values: PostInput) {
  submitting.value = true
  serverErrors.value = {}
  submitError.value = ''
  try {
    // PUT /posts/{id} to update, or POST /posts to create — both via axios. The
    // bearer token is attached automatically by the request interceptor in
    // lib/http, and the saved post comes back wrapped in `data`.
    const saved = isEdit.value
      ? await api.put<{ data: Post }>(`/posts/${editingId.value}`, values).then((r) => r.data.data)
      : await api.post<{ data: Post }>('/posts', values).then((r) => r.data.data)
    router.push({ name: 'post', params: { id: saved.id } })
  } catch (e) {
    serverErrors.value = getFieldErrors(e)
    submitError.value = getErrorMessage(e, 'Could not save the post')
  } finally {
    submitting.value = false
  }
}

onMounted(loadForEdit)
</script>

<template>
  <section class="mx-auto max-w-xl">
    <h1 class="mb-6 text-2xl font-bold text-slate-900">{{ isEdit ? 'Edit post' : 'New post' }}</h1>

    <SpinnerBlock v-if="loading" />
    <AlertError v-else-if="loadError" :message="loadError" />

    <template v-else>
      <AlertError
        v-if="submitError && Object.keys(serverErrors).length === 0"
        :message="submitError"
        class="mb-4"
      />
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PostForm
          :initial="initial"
          :submitting="submitting"
          :server-errors="serverErrors"
          :submit-label="isEdit ? 'Update post' : 'Create post'"
          @submit="onSubmit"
        >
          <template #actions>
            <RouterLink
              :to="isEdit ? { name: 'post', params: { id: editingId } } : { name: 'posts' }"
              class="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Cancel
            </RouterLink>
          </template>
        </PostForm>
      </div>
    </template>
  </section>
</template>
