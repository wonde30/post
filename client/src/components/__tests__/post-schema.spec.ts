import { describe, it, expect } from 'vitest'
// postSchema now lives in the PostForm component, right next to the form that
// uses it. It's exported from PostForm's plain `<script>` block, so we can
// import and unit-test it here without rendering the component.
import { postSchema } from '../PostForm.vue'

describe('postSchema', () => {
  it('accepts a valid post', () => {
    const result = postSchema.safeParse({
      title: 'Hello',
      body: 'Some body text',
      author: 'Ada',
      published: true,
    })
    expect(result.success).toBe(true)
  })

  it('requires a title and body', () => {
    const result = postSchema.safeParse({ title: '', body: '', published: false })
    expect(result.success).toBe(false)
    const fields = result.success ? [] : result.error.issues.map((i) => i.path[0])
    expect(fields).toContain('title')
    expect(fields).toContain('body')
  })

  it('rejects an author longer than 100 characters', () => {
    const result = postSchema.safeParse({
      title: 'Ok',
      body: 'Ok',
      author: 'a'.repeat(101),
      published: false,
    })
    expect(result.success).toBe(false)
  })
})
