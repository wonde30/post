# Vue.js Post Management

A Vue 3 frontend that consumes the **Laravel Posts API** (`laravel-intern-tutorial`).
It mirrors that backend's CRUD + Sanctum auth so the intern tutorial is end-to-end.

**Stack:** Vue 3 (`<script setup>` + TypeScript) · Vue Router · Pinia · Tailwind CSS v4 ·
axios · zod (validation).

## Features

- Browse posts (public, paginated) and read a single post
- Register / log in / log out (Sanctum bearer token, stored in `localStorage`)
- Create, edit and delete your own posts (owner-only, enforced by the API)
- "My posts" page
- Client-side validation with **zod** that mirrors Laravel's `PostRequest`, plus
  server-side 422 errors shown under the matching fields

## Project layout

> **Note for first-timers:** to keep the wiring visible, each page makes its own
> API calls and defines its own validation schema _inline_ — there is no shared
> `api/` or `schemas/` layer to jump to. Most calls use **axios** (the shared
> `api` instance in `lib/http`); the **delete post** action is written with the
> browser's built-in **`fetch`** instead, so you can compare the two.

```
src/
├─ components/     # PostCard, PostForm (holds the post schema), PostList, AppHeader, ui/*
├─ composables/    # usePostList (shared list logic)
├─ lib/            # http (axios instance + interceptors), validation, format
├─ stores/         # Pinia auth store (token, current user, login/register/logout calls)
├─ views/          # each page does its own fetching + validation inline
├─ router/         # routes + auth guard
└─ types.ts        # Post / User / Paginated response shapes
```

## Run it

1. **Start the Laravel API** (in `../laravel-intern-tutorial`):

   ```sh
   php artisan migrate
   php artisan serve            # http://localhost:8000
   ```

2. **Point the frontend at the API** — `.env` (already created):

   ```sh
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start the frontend:**

   ```sh
   npm install
   npm run dev                  # http://localhost:5173
   ```

## Scripts

```sh
npm run dev          # dev server
npm run build        # type-check + production build
npm run test:unit    # vitest (includes a zod schema test)
npm run lint         # oxlint + eslint
```

## API contract (from the Laravel app)

| Method | Path            | Auth | Purpose            |
| ------ | --------------- | ---- | ------------------ |
| GET    | `/posts`        | —    | list (paginated)   |
| GET    | `/posts/{id}`   | —    | single post        |
| POST   | `/posts`        | ✓    | create             |
| PUT    | `/posts/{id}`   | ✓    | update (owner)     |
| DELETE | `/posts/{id}`   | ✓    | delete (owner)     |
| GET    | `/my-posts`     | ✓    | current user posts |
| POST   | `/register`     | —    | sign up → token    |
| POST   | `/login`        | —    | log in → token     |
| POST   | `/logout`       | ✓    | revoke token       |
| GET    | `/me`           | ✓    | current user       |

Post fields: `title` (required, ≤255), `body` (required), `author` (optional, ≤100),
`published` (boolean).
