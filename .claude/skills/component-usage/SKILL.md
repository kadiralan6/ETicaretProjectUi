---
name: component-usage
description: Chakra UI v3 component usage patterns, existing component catalog, and form creation patterns for Tooligo Frontend
---

# Component Usage Patterns

## Existing Chakra UI Wrapper Components

There are 18 primitive wrappers under `components/ChakraUiBase/`. **Always use these instead of raw Chakra components.**

Import pattern: `import { ComponentName } from "@/components/ChakraUiBase/ComponentName";`

| Component | Usage |
|---|---|
| `Accordion` | Collapsible sections |
| `Alert` | Alert messages |
| `Avatar` | User avatar |
| `Badge` | Label/badge |
| `Breadcrumb` | Page navigation breadcrumb |
| `Button` | Standard button |
| `Checkbox` | Checkbox |
| `Drawer` | Side panel |
| `Input` | Text input |
| `Popup` | Modal/dialog |
| `ProgressCircle` | Circular progress |
| `Select` | Dropdown menu |
| `Switch` | Toggle switch |
| `Tabs` | Tab navigation |
| `Text` | Text component |
| `Textarea` | Multi-line text |
| `Toaster` | Toast notifications |
| `Tooltip` | Tooltip |

## Form Components

Controlled components integrated with react-hook-form under `components/Form/`:

```tsx
import { ControlledInput } from "@/components/Form/ControlledInput/ControlledInput";
import { ControlledSelectBox } from "@/components/Form/ControlledSelectBox/ControlledSelectBox";
import { ControlledTextarea } from "@/components/Form/ControlledTextarea/ControlledTextarea";
import { ControlledSwitch } from "@/components/Form/ControlledSwitch/ControlledSwitch";
import { ControlledRadioButton } from "@/components/Form/ControlledRadioButton/ControlledRadioButton";
import { ErrorMessage } from "@/components/Form/ErrorMessage/ErrorMessage";
```

## Form Creation Pattern

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/providers/TranslationProvider";

const MyForm = () => {
  const { t } = useTranslation();

  const schema = mySchema(t);
  type SchemaType = z.infer<typeof schema>;

  const { control, handleSubmit, formState: { errors } } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      await nextApiClient.post(NEXT_API_URLS.XXX, data);
      toast.success(t("common.success"), t("messages.created"));
    } catch (error: any) {
      toast.error(t("common.error"), error?.Message || t("messages.genericError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput name="name" control={control} label={t("form.name")} />
      <ControlledInput name="email" control={control} label={t("form.email")} />
      <Button type="submit">{t("common.save")}</Button>
    </form>
  );
};
```

## Zod Validation Schema (with translations)

Create Zod schemas under `validations/`. Schemas that need translations accept `t` function:

```ts
import { z } from "zod";

export const mySchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validationSchema.nameRequired")),
    email: z.string().email(t("validationSchema.emailValid")),
  });

export type MySchemaType = z.infer<ReturnType<typeof mySchema>>;
```

## Key GeneralUi Components

| Component | Usage |
|---|---|
| `DataTable` | Filtered, paginated table |
| `DatePicker` | Date picker |
| `DeleteConfirmPopup` | Delete confirmation |
| `EmptyState` | Empty data state |
| `FilterButtonGroup` | Filter button group |
| `LoadingPage` | Loading page |
| `Pagination` | Pagination |
| `ProductCard` | Product display card |
| `ProductCarousel` | Product carousel |
| `UploadImages` | Image upload component |
| `Container` | Page-level container |
| `ProfileAvatar` | Profile avatar display |
| `LoginPopup` | Login modal |
| `OtpPopup` | OTP verification popup |
| `PhoneInput` | Phone number input |
| `AddressDrawer` | Address form drawer |
| `BasketDrawer` | Shopping basket drawer |
| `CreditCardDrawer` | Credit card management drawer |
| `IgoBot` | AI chatbot component |
| `IntercomChat` | Intercom chat widget |

## Toast Usage

```tsx
import { toast, toaster } from "@/components/ChakraUiBase/Toaster";

// With translated strings (preferred)
toast.success(t("common.success"), t("messages.operationComplete"));
toast.error(t("common.error"), error?.Message || t("messages.genericError"));
toast.warning(t("common.warning"), t("messages.warningMessage"));
toast.info(t("common.info"), t("messages.infoMessage"));
toast.primary(t("common.important"), t("messages.importantMessage"));

// Loading toast with cleanup
const loadingId = toast.loading(t("common.loading"), t("messages.pleaseWait"));
// After completion:
toaster.remove(loadingId);
```

Toast API signature: `toast.[type](title: string, description?: string)`

**Note:** `toast` is for creating, `toaster` is the raw `createToaster` instance for `remove`/`dismiss`.

## Style Guidelines

- Use Chakra UI v3 Box, Flex, Grid, Stack for layout.
- Color tokens: `primary.60`, `text.90`, `gray.30`, `error.base`, etc.
- Spacing: use explicit `px` strings — `p="16px"`, `gap="8px"`, `m={{ base: "8px", md: "16px" }}`.
- **Do NOT use numeric Chakra spacing scale** (e.g., `p={4}`, `gap={2}`).
- Responsive: `{{ base: "100%", md: "50%", lg: "33%" }}`.
