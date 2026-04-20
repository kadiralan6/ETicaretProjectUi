---
paths:
  - "app/api/**/*.ts"
---

# API Route Rules

## BFF Proxy Architecture

All API routes are BFF proxies. Client components NEVER call the backend directly.

```
Client → nextApiClient → /api/* → httpClient → Backend
```

## Mandatory Error Pattern

```ts
try {
  const response = await httpClient.post(BACKEND_ENDPOINT, body);
  return NextResponse.json(response.data);
} catch (error: any) {
  const errorData = error.response?.data || {};
  return NextResponse.json(errorData, {
    status: errorData.StatusCode || 500,
  });
}
```

## Rules

1. Use `httpClient` (from `@/util/httpClient`) — NEVER `nextApiClient` in API routes.
2. Error handling: always `error.response?.data`, never `error.message`.
3. Status code: always `errorData.StatusCode || 500`.
4. Dynamic route params in Next.js 16: `params` is a `Promise` — must `await params`.
5. File uploads: use `request.formData()`, not `request.json()`.
6. For public endpoints: `httpClient.post(URL, body, { skipAuth: true })`.
7. Backend endpoint constants: defined in `constants/apiEndpoints.ts`.
8. BFF endpoint constants: defined in `constants/nextApi.ts` → `NEXT_API_URLS`.
