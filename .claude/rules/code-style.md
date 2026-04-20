---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Code Style & File Writing Standards

## Import Order (Strictly Follow)

```typescript
"use client"; // Only in client components

// 1. React and Next.js imports
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

// 2. Chakra UI imports
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";

// 3. Project internal component imports
import { ControlledInput } from "@/components/form/ControlledInput/ControlledInput"; // lowercase "form"
import { AdminHeader } from "@/components/admin/AdminHeader";

// 4. Form and validation imports
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 5. TanStack Query imports
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 6. Redux imports
import { useSelector, useDispatch } from "react-redux";

// 7. Translation imports
import { useTranslation } from "@/providers/TranslationProvider";

// 8. Utility imports
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import { QUERY_KEYS } from "@/constants/queryKeyConstants";

// 9. Interface imports
import { IUserDetail } from "@/interfaces/IUserDetail";

// 10. Validation schema imports
import { mySchema } from "@/validations/mySchema";
```

## Component Export Standards

```typescript
// Only in page.tsx files — default export, async function
export default async function PageName() { ... }

// In all other components — named arrow function export
export const ComponentName = () => { ... };
```

## Component File Layout Rules

- Do **NOT** put helper functions at module level above the main `export const` component.
- Keep helpers **inside** the component body (`useMemo`, `useCallback`, nested functions).
- Exceptions: Zod schemas, type definitions, plain constant primitives.
- **One `export const` component per file** in `components/` and `pages-lib/`.
- Non-exported sub-components go **after** imports/types, before the main component.

## Component Content Order (Inside Component)

1. **Zod schema** (if defined inline)
2. **Route/navigation hooks** (`useRouter`, `useParams`, `useSearchParams`)
3. **Translation hook** (`useTranslation`)
4. **Redux hooks** (`useSelector`, `useDispatch`)
5. **State hooks** (`useState`)
6. **Ref hooks** (`useRef`)
7. **TanStack Query hooks** (`useQuery`, `useMutation`)
8. **Form hooks** (`useForm`)
9. **Watch variable assignments** (`watch("field")`)
10. **Handler functions** (`handleSubmit`, `handleClick`, etc.)
11. **useEffect hooks** (LAST, immediately before `return`)
12. **JSX Return** (loading → error → empty → main content)

## Comments

- Add **short comments** only where behavior is non-obvious (business rules, edge cases, API quirks).
- **Avoid noise:** don't comment every block or restate what code already says clearly.

## Prettier Config

- Semicolons: yes
- Quotes: double quotes (`"`)
- Tab width: 2 spaces
- Print width: 80
- Arrow parens: always
- Trailing comma: all
