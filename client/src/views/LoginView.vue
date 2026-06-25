<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useRoute, useRouter } from 'vue-router'
import { fieldErrors } from '@/lib/validation'
import { getErrorMessage, getFieldErrors } from '@/lib/http'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertError from '@/components/ui/AlertError.vue'

// Validation rules for this page, defined right where they're used.
// Mirrors AuthController@login.
const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const formError = ref('')

async function onSubmit() {
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    errors.value = fieldErrors(result.error)
    return
  }
  errors.value = {}
  formError.value = ''
  submitting.value = true
  try {
    await auth.login(result.data)
    router.push((route.query.redirect as string) || '/')
  } catch (e) {
    errors.value = getFieldErrors(e)
    formError.value = getErrorMessage(e, 'Login failed')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-sm">
    <h1 class="mb-6 text-2xl font-bold text-slate-900">Log in</h1>

    <AlertError
      v-if="formError && Object.keys(errors).length === 0"
      :message="formError"
      class="mb-4"
    />

    <form
      class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="onSubmit"
    >
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
        autocomplete="current-password"
        :error="errors.password"
      />
      <BaseButton type="submit" :loading="submitting" class="w-full">Log in</BaseButton>
    </form>

    <p class="mt-4 text-center text-sm text-slate-500">
      No account?
      <RouterLink :to="{ name: 'register' }" class="font-semibold text-emerald-700 hover:underline">
        Sign up
      </RouterLink>
    </p>
  </section>
</template>
