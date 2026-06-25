<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  await auth.logout()
  router.push({ name: 'posts' })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
      <RouterLink
        :to="{ name: 'posts' }"
        class="text-lg font-extrabold tracking-tight text-slate-900"
      >
        📝 Posts
      </RouterLink>

      <nav class="flex items-center gap-3 text-sm font-medium text-slate-600">
        <RouterLink :to="{ name: 'posts' }" class="hover:text-emerald-700">All</RouterLink>
        <RouterLink
          v-if="auth.isAuthenticated"
          :to="{ name: 'my-posts' }"
          class="hover:text-emerald-700"
        >
          My posts
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-3 text-sm">
        <template v-if="auth.isAuthenticated">
          <RouterLink
            :to="{ name: 'post-create' }"
            class="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700"
          >
            New post
          </RouterLink>
          <span class="hidden text-slate-500 sm:inline">{{ auth.user?.name }}</span>
          <button
            type="button"
            class="font-medium text-slate-500 hover:text-slate-800"
            @click="onLogout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'login' }" class="font-medium text-slate-600 hover:text-emerald-700">
            Login
          </RouterLink>
          <RouterLink
            :to="{ name: 'register' }"
            class="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700"
          >
            Sign up
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
