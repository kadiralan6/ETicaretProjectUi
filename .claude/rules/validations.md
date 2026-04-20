---
paths:
  - "validations/**/*.ts"
---

# Validation Schema Rules

## File Naming

- Location: `validations/` directory
- Naming: `*Schema.ts` (e.g., `addressSchema.ts`, `loginSchema.ts`)

## Schema Pattern (with i18n)

Schemas that have user-facing validation messages MUST accept a `t` function:

```ts
import { z } from "zod";

export const mySchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validationSchema.nameRequired")),
    email: z.string().email(t("validationSchema.emailValid")),
    phone: z.string().min(10, t("validationSchema.phoneMinLength")),
  });

export type MySchemaType = z.infer<ReturnType<typeof mySchema>>;
```

## Usage in Component

```tsx
const { t } = useTranslation();
const schema = mySchema(t);

const { control, handleSubmit } = useForm<MySchemaType>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "", phone: "" },
});
```

## Rules

1. Always export both the schema function AND the inferred type.
2. Validation messages must use `t()` — never hardcode Turkish/English strings.
3. Add corresponding keys to both `dictionaries/tr.json` and `dictionaries/en.json`.
4. Use `validationSchema.*` key namespace for validation messages.
