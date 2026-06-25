// Shapes returned by the Laravel API (see PostResource / AuthController).

export interface User {
  id: number
  name: string
  email?: string
}

export interface Post {
  id: number
  title: string
  body: string
  author: string | null
  published: boolean
  user_id: number
  user?: { id: number; name: string }
  created_at: string
}

/** Laravel paginator shape: `PostResource::collection($paginator)`. */
export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}
