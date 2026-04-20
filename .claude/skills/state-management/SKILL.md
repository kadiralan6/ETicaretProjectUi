---
name: state-management
description: Server state (TanStack Query), client state (Redux), and form state (react-hook-form) patterns
---

# State Management Patterns

## 1. Server State — TanStack React Query v5

### Basic Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";
import { NEXT_API_URLS } from "@/constants/nextApi";
import nextApiClient from "@/util/nextApiClient";

const { data, isLoading, error, refetch } = useQuery({
  queryKey: [QUERY_KEYS.PRODUCT_DETAIL, productSlug],
  queryFn: async () => {
    const response = await nextApiClient.get(
      `${NEXT_API_URLS.PRODUCT_DETAIL}/${productSlug}`,
    );
    return response.data;
  },
  enabled: !!productSlug,
  retry: 2,
  staleTime: 5 * 60 * 1000,
});
```

### Table Data Pattern (useTableData)

```tsx
import { usePagination } from "@/util/usePagination";
import { useColumnFilters } from "@/util/useColumnFilters";
import useGlobalFilter from "@/util/useGlobalFilter";
import { useTableData } from "@/util/useTableData";

const { limit, skip, onPaginationChange, pagination } = usePagination();
const { columnFilters, setColumnFilters } =
  useColumnFilters(onPaginationChange);
const { globalFilter, setGlobalFilter } = useGlobalFilter(onPaginationChange);

const { data, totalCount, loading, refetchData } = useTableData(
  NEXT_API_URLS.MY_PRODUCTS,
  { pagination: { limit, skip }, globalFilter },
);
```

## 2. Client State — Redux Toolkit

Redux is used for **multiple slices** in this project:

| Slice                   | Purpose                    |
| ----------------------- | -------------------------- |
| `basketSlice`           | Shopping cart state        |
| `favoriteSlice`         | User favorites             |
| `userVerificationSlice` | User verification status   |
| `igoBotSlice`           | AI chatbot state           |
| `mobileCategorySlice`   | Mobile category navigation |
| `stepSlice`             | Multi-step form progress   |

### Usage Pattern

```tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";

const dispatch = useDispatch();
const basket = useSelector((state: RootState) => state.basket);
const isVerified = useSelector(
  (state: RootState) => state.userVerification.isVerified,
);
```

## 3. Form State — react-hook-form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = mySchema(t);
type FormData = z.infer<typeof schema>;

const {
  control,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" },
});
```

## 4. Auth State — next-auth

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
// session.accessToken, session.userType, session.isSeller, session.roles, etc.
```

## 5. Server-side Cached Data — "use cache"

```tsx
// network/lookupsFunction.ts
export async function getCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife({ revalidate: revalidateTime });
  return await getLookups(GET_ALL_CATEGORIES, true);
}
```

## Rules

- Query keys must be defined in `constants/queryKeyConstants.ts`.
- All API calls from client components go through `nextApiClient` → BFF route → backend (never direct).
- Don't add new Redux slices without justification — prefer TanStack Query for server state.
- Form state should always use react-hook-form + Zod, never `useState` for form fields.
