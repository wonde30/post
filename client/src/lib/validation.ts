import type { ZodError } from 'zod'

/** Flatten a Zod error into `{ field: firstMessage }` for showing under inputs. */
export function fieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!(key in out)) out[key] = issue.message
  }
  return out
}
