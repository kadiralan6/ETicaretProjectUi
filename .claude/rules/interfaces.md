---
paths:
  - "interfaces/**/*.ts"
---

# Interface Rules

## Naming Convention

- File: `I[Entity].ts` (e.g., `IProduct.ts`, `IOrder.ts`, `IAddress.ts`)
- Interface: `I[Entity]` prefix (e.g., `IProductDetail`, `IOrderSignalR`)

## Pattern

```ts
export interface IMyEntity {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  items?: IMyEntityItem[];
}

export interface IMyEntityItem {
  id: string;
  parentId: string;
  value: number;
}
```

## Rules

1. Always use `I` prefix for interface names.
2. One primary interface per file (related sub-interfaces are okay in same file).
3. Use `string` for date fields (ISO format from backend).
4. Use `?` for optional fields, not `| undefined`.
5. Don't use `enum` inside interfaces — reference enums from `constants/enum.ts`.
