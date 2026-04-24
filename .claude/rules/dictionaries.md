---
paths:
  - "dictionaries/**/*.json"
---

# Dictionary / i18n Rules

## Structure

- `dictionaries/tr.json` — Turkish (primary language)
- `dictionaries/en.json` — English

Both files must always have the **same set of keys** (same shape).

## Rules

1. **Always update BOTH files** when adding or modifying translation keys.
2. **At most two object levels** (no third nesting level):
   - A **root** object (`{ ... }`).
   - Under it, **one** grouping / namespace object may exist (`header`, `common`, `orderDetail`, `validationSchema`, …).
   - Values inside that group must be **strings only**; **do not nest another object** (e.g. for `orderDetail.foo.bar`, do not open another `{ }` under `foo`).
3. The root may contain string keys directly (e.g. `"productName"`); that is a single level and does not conflict with this rule.
4. Use the **`validationSchema`** group for form validation copy; use **`common`** for shared UI strings.
5. Use **camelCase** for key segments (`rentalFee`); do not use kebab-case or snake_case.

## `t()` usage

- Two levels: `t("orderDetail.rentalFee")` → `orderDetail` object with a `rentalFee` string inside.
- Do not add another object for a third segment; use a flat key at the second level instead, e.g. `t("orderDetail.extensionStatusPendingApproval")` (or follow existing naming like `extensionStatusX`).

## Lookup

[`TranslationProvider`](../../providers/TranslationProvider.tsx) first tries a **root key** equal to the full `key` string (flat dictionary). If missing, it walks the dotted path through nested objects. New keys should follow the depth rule in this document.

## Example (allowed)

```json
{
  "productName": "Tooligo",
  "myFeature": {
    "title": "Feature title",
    "description": "Description text"
  }
}
```

## Example (not allowed)

```json
{
  "myFeature": {
    "section": {
      "title": "…"
    }
  }
}
```

A third object level under `section` must not be added.
