---
paths:
  - "pages-lib/**/*.tsx"
  - "pages-lib/**/*.ts"
---

# pages-lib Rules

## Structure

Each page module gets its own folder:

```
pages-lib/
└── MyFeaturePage/
    ├── MyFeaturePage.tsx       # Main page component ("use client")
    ├── SomeSection.tsx         # Page-specific sub-component (optional)
    └── Columns.tsx             # DataTable column definitions (if table page)
```

## Main Component Pattern

```tsx
"use client";

import { Box } from "@chakra-ui/react";
import { useTranslation } from "@/providers/TranslationProvider";
// ... other imports following import order

export const MyFeaturePage = () => {
  const { t } = useTranslation();

  // hooks, state, handlers...

  if (isLoading) return <LoadingPage />;

  return (
    <Box w="100%" p={{ base: "16px", md: "32px" }}>
      {/* content */}
    </Box>
  );
};
```

## Rules

1. `"use client"` directive is REQUIRED.
2. Folder name = Component name = File name (PascalCase).
3. `export const` (not `export default`).
4. All user-facing text via `t()` — never hardcode.
5. Handle loading/error/empty states before main return.
6. `useEffect` hooks placed LAST, right before `return`.
7. One primary `export const` per file.
8. Page-specific helpers stay inside the component body, not at module level.
9. Shared/reusable logic goes to `util/` ONLY if used in 2+ places.
