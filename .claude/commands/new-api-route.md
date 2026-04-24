# New API Route Generator

Create a new BFF API route for: $ARGUMENTS

Follow these steps:

1. Add the backend endpoint constant to `constants/tooligoApi.ts`
2. Add the BFF endpoint to `constants/nextApi.ts` → `NEXT_API_URLS`
3. Create the route handler at `app/api/[module]/route.ts`

Use the patterns from `.claude/skills/create-api-route/SKILL.md`.

Rules:
- Use `httpClient` for server-side requests (never `nextApiClient`)
- Error handling: `error.response?.data` with `errorData.StatusCode || 500`
- Support `params` for dynamic routes (Next.js 16: `params` is a Promise)
- For file uploads, use `request.formData()` instead of `request.json()`
