---
name: create-page
description: Step-by-step guide for creating a new page in Tooligo Frontend with locale support
---

# Creating a New Page

This skill describes all the steps required to add a new page to the Tooligo frontend.

## Required Files

Using a "Reviews" page as an example (`reviews`):

### 1. Add Constants

**`constants/tooligoApi.ts`** — Add the backend endpoint:
```ts
export const GET_ALL_REVIEWS: string = `${TOOLIGO_API_BASE_URL}/gateway/social/Reviews/GetAll`;
```

**`constants/nextApi.ts`** — Add the BFF endpoint:
```ts
export const NEXT_API_URLS = {
  // ...existing URLs
  REVIEWS: "/reviews",
};
```

**`constants/queryKeyConstants.ts`** — Add a query key:
```ts
export const QUERY_KEYS = {
  // ...existing keys
  REVIEWS: "reviews",
};
```

**`constants/route.ts`** — Add a route constant:
```ts
export const routes = {
  // ...
  reviews: "/reviews",
};
```

### 2. Create Interface

**`interfaces/IReview.ts`**:
```ts
export interface IReview {
  id: string;
  title: string;
  // ...other fields
}
```

### 3. Create API Route (BFF Proxy)

**`app/api/reviews/route.ts`**:
```ts
import { GET_ALL_REVIEWS } from "@/constants/tooligoApi";
import httpClient from "@/util/httpClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const response = await httpClient.post(GET_ALL_REVIEWS, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
```

### 4. Create pages-lib Component

**`pages-lib/ReviewsPage/ReviewsPage.tsx`** (`"use client"`):
```tsx
"use client";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "@/providers/TranslationProvider";
import { Breadcrumb } from "@/components/ChakraUiBase/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { NEXT_API_URLS } from "@/constants/nextApi";
import nextApiClient from "@/util/nextApiClient";
import { LoadingPage } from "@/components/GeneralUi/LoadingPage/LoadingPage";
import { EmptyState } from "@/components/GeneralUi/EmptyState/EmptyState";

export const ReviewsPage = () => {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.REVIEWS],
    queryFn: async () => {
      const response = await nextApiClient.post(NEXT_API_URLS.REVIEWS, {});
      return response.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <Box w="100%" p={{ base: "16px", md: "32px" }}>
      <Breadcrumb items={[
        { title: t("common.home"), url: "/" },
        { title: t("reviews.title"), url: "/reviews" },
      ]} />
      <Box my={{ base: "24px", md: "16px" }}>
        {/* Page content */}
      </Box>
    </Box>
  );
};
```

### 5. Create App Router Page (with locale)

**`app/[lang]/(dashboard)/reviews/page.tsx`**:
```tsx
import { ReviewsPage } from "@/pages-lib/ReviewsPage/ReviewsPage";

export default async function Index() {
  return <ReviewsPage />;
}
```

Note: Pages can also do server-side data fetching and pass as props:
```tsx
import { ReviewsPage } from "@/pages-lib/ReviewsPage/ReviewsPage";
import { getServerData } from "@/network/lookupsFunction";

export default async function Index() {
  const serverData = await getServerData();
  return <ReviewsPage serverData={serverData} />;
}
```

### 6. Configure Route Access (if needed)

**`constants/route.ts`** — Add to relevant route arrays:
```ts
// If page requires authentication
export const protectedRoutes = [
  // ...existing
  routes.reviews,
];

// If page should NOT show footer
export const noFooterRoutes = [
  // ...existing
  routes.reviews,
];

// If page should NOT show navigation bar
export const noNavigationBarRoutes = [
  // ...existing
  routes.reviews,
];
```

### 7. Add SEO Metadata (optional)

```tsx
// In page.tsx — add generateMetadata for SEO
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reviews | Tooligo",
    description: "User reviews and ratings",
  };
}
```

### 8. Add to Navigation (if needed)

Update relevant navigation components like the header menu, profile menu, or footer links.

## Key Differences from Admin Panel

- **Locale routing**: All pages are under `app/[lang]/(dashboard)/` instead of `app/(dashboard)/`.
- **No permission system**: This is a customer-facing app using role checks (`useRole`) not permission codes.
- **i18n required**: All text must use `t()` from `useTranslation`, never hardcoded strings.
- **Layout groups**: `(authenticate)` for auth pages, `(dashboard)` for main app, `(footers)` for static pages.

## Checklist

- [ ] `tooligoApi.ts` → backend endpoint
- [ ] `nextApi.ts` → BFF endpoint
- [ ] `queryKeyConstants.ts` → query key
- [ ] `route.ts` → route constant
- [ ] `route.ts` → `protectedRoutes` (if auth required)
- [ ] `route.ts` → `noFooterRoutes` / `noNavigationBarRoutes` (if applicable)
- [ ] `interfaces/` → TypeScript interface
- [ ] `app/api/` → BFF proxy route
- [ ] `pages-lib/` → Client component ("use client")
- [ ] `app/[lang]/(dashboard)/` → Server component page (async)
- [ ] Navigation update (if applicable)
- [ ] i18n keys added to `dictionaries/tr.json` and `dictionaries/en.json`

