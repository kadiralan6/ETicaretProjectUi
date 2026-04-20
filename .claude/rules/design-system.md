---
paths:
  - "components/**/*.tsx"
  - "components/**/*.ts"
  - "pages-lib/**/*.tsx"
  - "pages-lib/**/*.ts"
---

# Design System & UI Rules

## Component Usage Priority

1. **Form fields:** `@/components/form/ControlledInput/ControlledInput` (lowercase `form`)
2. **Admin layout:** `@/components/admin/AdminHeader`, `@/components/admin/AdminSidebar`
3. **New components:** page-specific logic → `pages-lib/`; shared UI → `components/`

> Note: Use lowercase path `@/components/form/...` (not `Form`) — macOS filesystem is case-insensitive but TypeScript will flag casing conflicts.

## Spacing — CRITICAL

Use **explicit `px` strings** for all spacing props. NEVER use Chakra numeric scale.

```tsx
// ✅ CORRECT
<Box p="16px" m="8px" gap="12px" />
<Box p={{ base: "8px", md: "16px", lg: "24px" }} />

// ❌ WRONG — DO NOT DO THIS
<Box p={4} m={2} gap={3} />
<Box p={{ base: 2, md: 4 }} />
```

## Color Tokens

Use standard Chakra UI color tokens. This project does NOT have a custom theme with semantic tokens — use standard Chakra colors or inline hex/rgb values as needed.

```tsx
// ✅ Standard Chakra colors
<Box bg="blue.500" color="white" />
<Box borderColor="gray.200" />
<Text color="red.500" />

// ✅ Inline for one-off values
<Box bg="#f5f5f5" />
```

## Layout & Responsive

```tsx
// Responsive width
<Box w={{ base: "100%", sm: "50%", md: "33%", lg: "25%" }} />

// Responsive grid
<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={{ base: "16px", md: "24px" }} />

// Responsive font size
<Text fontSize={{ base: "sm", md: "md", lg: "lg" }} />
```

## JSX Best Practices

- Prefer **shallowest JSX** — avoid wrapper elements when not needed.
- Use semantic HTML where appropriate.
- Match responsive breakpoints (`base` / `md` / `lg`) consistently across related components.
- Images: meaningful `alt` attribute, use `next/image`.

## Toast Notifications

This project uses `react-hot-toast`:

```tsx
import toast from "react-hot-toast";

toast.success("İşlem başarılı");
toast.error("Bir hata oluştu");
```

`<Toaster />` is mounted in `src/app/providers.tsx` — do NOT add it elsewhere.
