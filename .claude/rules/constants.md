---
paths:
  - "constants/**/*.ts"
---

# Constants Rules

## File Responsibilities

| File | Purpose |
|---|---|
| `apiEndpoints.ts` | Backend API endpoint URLs (full paths used by `httpClient`) |
| `nextApi.ts` | BFF route paths (`NEXT_API_URLS` object) |
| `queryKeyConstants.ts` | TanStack Query cache keys (`QUERY_KEYS` object) |
| `routes.ts` | App route path constants |
| `queryKeys.ts` | Legacy — prefer `queryKeyConstants.ts` for new code |

## Pattern — Backend Endpoint

```ts
// constants/apiEndpoints.ts
const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const MY_ENDPOINT: string = `${BASE_URL}/api/catalog/Controller/Action`;
```

> ⚠️ NEVER modify `apiEndpoints.ts` values — they are live backend routes.
> `httpClient` in `src/util/httpClient.ts` uses these directly.

## Pattern — BFF Endpoint

```ts
// constants/nextApi.ts — add inside NEXT_API_URLS object
export const NEXT_API_URLS = {
  // ...existing
  MY_FEATURE: "/my-feature",
  MY_FEATURE_BY_ID: (id: string | number) => `/my-feature/${id}`,
} as const;
```

> BFF paths are relative (no `/api` prefix — `nextApiClient` prepends `/api` automatically).

## Pattern — Query Key

```ts
// constants/queryKeyConstants.ts — add inside QUERY_KEYS object
export const QUERY_KEYS = {
  // ...existing
  MY_FEATURE: "myFeature",
  MY_FEATURE_DETAIL: (id: string | number) => ["myFeature", String(id)] as const,
} as const;
```

## Rules

1. Backend endpoints live in `apiEndpoints.ts` — full URL strings using `BASE_URL`.
2. BFF endpoints in `NEXT_API_URLS` are relative paths (e.g. `"/products"`).
3. Query keys in `QUERY_KEYS` use camelCase string values.
4. When adding a new feature, update all three constant files: `apiEndpoints.ts`, `nextApi.ts`, `queryKeyConstants.ts`.
5. `nextApiClient` (from `@/util/nextApiClient`) is for client components → BFF layer.
6. `httpClient` (from `@/util/httpClient`) is for API routes (server) → backend.
