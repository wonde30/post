import { ref } from 'vue'
import type { Post, Paginated } from '@/types'
import { getErrorMessage } from '@/lib/http'

/**
 * Shared list logic for the "all posts" and "my posts" pages.
 * Pass the API function that fetches a page; get back reactive state + actions.
 */
export function usePostList(fetcher: (page: number) => Promise<Paginated<Post>>) {
  const posts = ref<Post[]>([])
  const currentPage = ref(1)
  const lastPage = ref(1)
  const loading = ref(false)
  const error = ref('')

  async function load(page = currentPage.value) {
    loading.value = true
    error.value = ''
    try {
      const res = await fetcher(page)
      posts.value = res.data
      currentPage.value = res.meta.current_page
      lastPage.value = res.meta.last_page
    } catch (e) {
      error.value = getErrorMessage(e, 'Could not load posts')
    } finally {
      loading.value = false
    }
  }

  function changePage(page: number) {
    load(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** Drop a post from the current page after it's deleted (no refetch). */
  function removeFromList(id: number) {
    posts.value = posts.value.filter((p) => p.id !== id)
  }

  return { posts, currentPage, lastPage, loading, error, load, changePage, removeFromList }
}
