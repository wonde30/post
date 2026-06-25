<script lang="ts">
import { z } from 'zod'

// The post validation schema lives right here, next to the form that uses it.
// It mirrors Laravel's PostRequest rules:
//   title     => required|string|max:255
//   body      => required|string
//   author    => nullable|string|max:100
//   published => boolean
// It's defined in this plain `<script>` block (not `<script setup>`) so it can be
// exported — PostEditView imports the `PostInput` type, and a unit test imports
// `postSchema` itself.
export const postSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Keep the title under 255 characters'),
  body: z.string().trim().min(1, 'Body is required'),
  author: z.string().trim().max(100, 'Keep the author under 100 characters').optional(),
  published: z.boolean(),
})

export type PostInput = z.infer<typeof postSchema>
</script>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { fieldErrors } from '@/lib/validation'
import type { Post } from '@/types'
import BaseInput from './ui/BaseInput.vue'
import BaseTextarea from './ui/BaseTextarea.vue'
import BaseButton from './ui/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    initial?: Post | null
    submitting?: boolean
    serverErrors?: Record<string, string>
    submitLabel?: string
  }>(),
  { initial: null, submitting: false, submitLabel: 'Save post' },
)

const emit = defineEmits<{ submit: [values: PostInput] }>()

const form = reactive({
  title: props.initial?.title ?? '',
  body: props.initial?.body ?? '',
  author: props.initial?.author ?? '',
  published: props.initial?.published ?? false,
})

const errors = ref<Record<string, string>>({})

// Surface server-side validation errors (Laravel 422) under the matching fields.
watch(
  () => props.serverErrors,
  (val) => {
    if (val) errors.value = { ...errors.value, ...val }
  },
  { immediate: true },
)

function onSubmit() {
  // Validate on the client first with the same rules the API enforces.
  const result = postSchema.safeParse({
    title: form.title,
    body: form.body,
    author: form.author.trim() === '' ? undefined : form.author,
    published: form.published,
  })

  if (!result.success) {
    errors.value = fieldErrors(result.error)
    return
  }

  errors.value = {}
  emit('submit', result.data)
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <BaseInput
      id="title"
      v-model="form.title"
      label="Title"
      placeholder="A catchy title"
      :error="errors.title"
    />

    <BaseTextarea
      id="body"
      v-model="form.body"
      label="Body"
      placeholder="Write your post…"
      :error="errors.body"
    />

    <BaseInput
      id="author"
      v-model="form.author"
      label="Author (optional)"
      placeholder="Pen name"
      :error="errors.author"
    />

    <label class="flex w-fit items-center gap-3">
      <input
        v-model="form.published"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span class="text-sm font-medium text-slate-700">Publish this post</span>
    </label>

    <div class="flex items-center gap-3 pt-2">
      <BaseButton type="submit" :loading="submitting">{{ submitLabel }}</BaseButton>
      <slot name="actions" />
    </div>
  </form>
</template>
