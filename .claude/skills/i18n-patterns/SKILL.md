---
name: i18n-patterns
description: Internationalization patterns - translations, locale routing, and dictionary management
---

# Internationalization (i18n) Patterns

## Architecture

The project uses cookie-based locale detection with URL prefix routing:

```
Middleware (proxy.ts) → detects/sets locale cookie → redirects to /[lang]/...
app/[lang]/layout.tsx → getDictionary(lang) → TranslationProvider
Client components → const { t, locale } = useTranslation();
```

## Supported Locales

- `tr` — Turkish (default)
- `en` — English

## Dictionary Files

- `dictionaries/tr.json` — Turkish translations
- `dictionaries/en.json` — English translations

Both files are large (~180KB) JSON objects with nested keys.

## Using Translations in Client Components

```tsx
"use client";
import { useTranslation } from "@/providers/TranslationProvider";

const MyComponent = () => {
  const { t, locale } = useTranslation();

  return (
    <Box>
      <Text>{t("common.save")}</Text>
      <Text>{t("common.save", "Save")}</Text>  {/* with fallback */}
      <Text>{t("product.title")}</Text>
      <Text>{t("validationSchema.emailRequired")}</Text>
    </Box>
  );
};
```

## Using Translations in Zod Schemas

When validation messages need to be translated, pass `t` as a parameter:

```ts
// validations/mySchema.ts
import { z } from "zod";

export const mySchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validationSchema.nameRequired")),
    email: z.string().email(t("validationSchema.emailValid")),
  });

export type MySchemaType = z.infer<ReturnType<typeof mySchema>>;
```

Usage in component:
```tsx
const { t } = useTranslation();
const schema = mySchema(t);

const { control, handleSubmit } = useForm<MySchemaType>({
  resolver: zodResolver(schema),
});
```

## Adding New Translation Keys

1. Add the key to **both** `dictionaries/tr.json` AND `dictionaries/en.json`
2. Use nested structure matching existing patterns:

```json
{
  "common": {
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil"
  },
  "myFeature": {
    "title": "Yeni Özellik",
    "description": "Açıklama metni"
  }
}
```

## Important Rules

1. **Never hardcode Turkish or English strings** — always use `t()`.
2. **Always add keys to both language files** at the same time.
3. **Use dot notation** for nested keys: `t("section.subsection.key")`.
4. **Provide a fallback** for critical UI text: `t("key", "Fallback text")`.
5. The `locale` variable gives current language (`"tr"` or `"en"`) for conditional logic.
6. Server components can use `getDictionary(lang)` directly for server-rendered text.
