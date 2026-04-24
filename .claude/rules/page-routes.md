---
paths:
  - "app/**/*.tsx"
  - "app/**/*.ts"
---

# Page Route Rules

## Route Structure

Shop and auth pages are under `app/[lang]/` (locale-aware). Admin stays without lang.

- `app/[lang]/(auth)/login/` — Login (unprotected)
- `app/[lang]/(shop)/` — Customer-facing shop pages (with Navbar)
- `app/[lang]/(shop)/product/[slug]/` — Product detail page
- `app/admin/(protected)/` — Admin pages (NextAuth-protected, hardcoded "tr")
- `app/admin/login/` — Admin login (unprotected)
- `app/admin/` — Admin root redirect

`src/middleware.ts` redirects `/` → `/tr/` (default locale).
`app/[lang]/layout.tsx` provides `TranslationProvider` based on URL lang segment.
`app/admin/(protected)/layout.tsx` provides `TranslationProvider lang="tr"` for admin.

## page.tsx — Server Component (MUST follow)

```tsx
// app/(shop)/products/page.tsx
import { ProductsPage } from "@/pages-lib/ProductsPage/ProductsPage";

export default async function Index() {
  return <ProductsPage />;
}
```

```tsx
// app/admin/(protected)/products/[id]/page.tsx
import { AdminProductDetailPage } from "@/pages-lib/AdminProductDetailPage/AdminProductDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Index({ params }: PageProps) {
  return <AdminProductDetailPage params={params} />;
}
```

Rules:
- `page.tsx` MUST be an **async server component** (no `"use client"`)
- Use `export default async function Index()` (not arrow function, not other names)
- Keep thin — only import and render the pages-lib component
- For dynamic params: pass `params` prop as `Promise<{ id: string }>` to pages-lib

## pages-lib — Client Component

```tsx
// pages-lib/AdminProductsPage/AdminProductsPage.tsx
"use client";

export const AdminProductsPage = () => {
  const { t } = useTranslation();
  // All client logic here
};
```

Rules:
- MUST have `"use client"` directive
- Use `export const` (not `export default`)
- All hooks, state, handlers, and effects live here
- Folder naming: `PascalCase` matching the component name

## Protected Routes

Admin routes under `app/admin/(protected)/` are protected via NextAuth middleware.
Public routes: `app/(auth)/login`, `app/admin/login`.
