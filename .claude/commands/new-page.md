# New Page Generator

Create a new page with all required files for the route: $ARGUMENTS

Follow these steps in order:

1. Add the backend endpoint to `constants/tooligoApi.ts`
2. Add the BFF endpoint to `constants/nextApi.ts` → `NEXT_API_URLS`
3. Add a query key to `constants/queryKeyConstants.ts` → `QUERY_KEYS`
4. Add a route to `constants/route.ts` → `routes`
5. Create the TypeScript interface in `interfaces/`
6. Create the BFF proxy route in `app/api/[module]/route.ts`
7. Create the client component in `pages-lib/[PageName]/[PageName].tsx` with `"use client"`
8. Create the server component page in `app/[lang]/(dashboard)/[route]/page.tsx`
9. Add translation keys to `dictionaries/tr.json` and `dictionaries/en.json`

Use the patterns defined in `.claude/skills/create-page/SKILL.md` and `.claude/skills/create-api-route/SKILL.md`.

Important reminders:
- All user-facing text must use `t()` from `useTranslation`
- Use explicit `px` strings for spacing (not numeric Chakra scale)
- page.tsx must be an async server component
- pages-lib component must have `"use client"` directive
- Follow the existing import order convention from `.cursor/rules/tooligo-rule.mdc`
