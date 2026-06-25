<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { fieldErrors } from '@/lib/validation'
import { getErrorMessage, getFieldErrors } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertError from '@/components/ui/AlertError.vue'

// Validation rules for this page, defined right where they're used.
// Mirrors AuthController@register (password|min:8|confirmed).
const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255, 'Keep the name under 255 characters'),
    email: z.email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const formError = ref('')

async function onSubmit() {
  const result = registerSchema.safeParse(form)
  if (!result.success) {
    errors.value = fieldErrors(result.error)
    return
  }
  errors.value = {}
  formError.value = ''
  submitting.value = true
  try {
    await auth.register(result.data)
    router.push({ name: 'posts' })
  } catch (e) {
    errors.value = getFieldErrors(e)
    formError.value = getErrorMessage(e, 'Registration failed')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-sm">
    <h1 class="mb-6 text-2xl font-bold text-slate-900">Create an account</h1>

    <AlertError
      v-if="formError && Object.keys(errors).length === 0"
      :message="formError"
      class="mb-4"
    />

    <form
      class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="onSubmit"
    >
      <BaseInput id="name" v-model="form.name" label="Name" autocomplete="name" :error="errors.name" />
      <BaseInput
        id="email"
        v-model="form.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <BaseInput
        id="password"
        v-model="form.password"
        label="Password"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <BaseInput
        id="password_confirmation"
        v-model="form.password_confirmation"
        label="Confirm password"
        type="password"
        autocomplete="new-password"
        :error="errors.password_confirmation"
      />
      <BaseButton type="submit" :loading="submitting" class="w-full">Sign up</BaseButton>
    </form>

    <p class="mt-4 text-center text-sm text-slate-500">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-emerald-700 hover:underline">
        Log in
      </RouterLink>
    </p>
  </section>
</template>
