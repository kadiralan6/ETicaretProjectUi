# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured yet.

## Architecture Overview

This is a **Next.js 16 App Router** e-commerce frontend with two distinct route trees:

- `src/app/[lang]/(shop)/` — Customer-facing storefront with i18n (`tr`/`en`)
- `src/app/admin/(protected)/` — Admin panel (Turkish only, hardcoded `lang="tr"`)

### BFF Pattern (Critical)

The app uses a **Backend-for-Frontend** layer. Client components **never** call the external backend directly:

```
Client Component → nextApiClient (/api/*) → Next.js Route Handler → httpClient → External Backend
```

- `src/util/nextApiClient.ts` — Client-side axios instance, base URL `/api`
- `src/util/httpClient.ts` — Server-only axios instance (tagged `"server-only"`), attaches JWT from session, calls the real backend at `NEXT_PUBLIC_API_BASE_URL`
- `src/app/api/` — Route handlers that bridge the two (one file per domain: products, brands, categories, basket, orders)
- `src/constants/nextApi.ts` (`NEXT_API_URLS`) — Path constants for BFF routes
- `src/constants/apiEndpoints.ts` — Full URL constants for external backend endpoints

### State Management

- **TanStack Query** — all server/async data (products, brands, categories, orders, basket)
- **Redux Toolkit** — UI-only state: `basketSlice` and `uiSlice`
- Never use Redux for server data; never use TanStack Query for pure UI state

### Provider Stack

Defined in `src/app/providers.tsx`, order matters:
```
SessionProvider → QueryProvider → ReduxProvider → ChakraProvider → ThemeProvider
```
`TranslationProvider` is applied separately per layout (`[lang]/layout.tsx` and `admin/(protected)/layout.tsx`).

### i18n

- Supported locales: `tr` (default), `en`
- Middleware (`src/middleware.ts`) auto-redirects `/` → `/tr/` for shop routes; admin and API routes are excluded
- Dictionaries: `src/dictionaries/tr.json`, `src/dictionaries/en.json`
- Access via `useTranslation()` hook from `@/providers/TranslationProvider`; keys support dot notation (`"namespace.key"`)

### Page Architecture (`pages-lib/`)

Route files in `src/app/` are thin wrappers — actual page logic lives in `src/pages-lib/`. Each page gets its own folder with a single named export component (e.g., `AdminProductsPage`).

### Authentication

NextAuth v4 with CredentialsProvider. The backend JWT is stored in the session as `session.accessToken.token`. `httpClient` reads this server-side via `getServerSession`.

**Mock fallback** is active in `src/providers/AuthProvider.ts` when the backend is unavailable:
- `admin@test.com` / `123456` → Admin role
- `user@test.com` / `123456` → Customer role

### Interfaces

All domain types live in `src/interfaces/` with an `I`-prefix (e.g., `IProduct`, `IBrand`). Barrel export via `src/interfaces/index.ts`.

### Validations

Zod schemas in `src/validations/`. Each domain has a `*Schema.ts` (Zod schema) and a `*Validation.ts` (inferred TypeScript type). Use `zodResolver` from `@hookform/resolvers/zod` with react-hook-form.

## Code Style

See `.claude/rules/code-style.md` for the full rules. Key points:

- **Import order**: React/Next → Chakra UI → internal components → form/validation → TanStack Query → Redux → translation → utilities → interfaces → validation schemas
- `page.tsx` files use `export default async function`; all other components use `export const ComponentName = () => {}`
- Component content order: Zod schema → route hooks → translation → Redux → useState → useRef → useQuery/useMutation → useForm → watch → handlers → useEffect → JSX return
- No helper functions at module level above the main `export const` component; keep them inside the component body
- Prettier: semicolons, double quotes, 2-space indent, 80 char width, trailing commas
