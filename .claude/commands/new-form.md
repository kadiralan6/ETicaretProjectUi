# New Form Component

Create a new form component for: $ARGUMENTS

Follow these steps:

1. Create a Zod validation schema in `validations/[name]Schema.ts`
   - Accept `t` function parameter for translated validation messages
   - Export both the schema function and the inferred type
2. Create the form component in the relevant `pages-lib/` directory
   - Use `react-hook-form` with `zodResolver`
   - Use `Controlled*` components from `components/Form/`
   - Handle submission with `nextApiClient` + toast feedback
   - All labels and validation messages via `t()`

Use patterns from `.claude/skills/component-usage/SKILL.md`.

Rules:
- Use `ControlledInput`, `ControlledSelectBox`, `ControlledTextarea`, etc.
- Never use uncontrolled inputs or raw `useState` for form fields
- Use explicit `px` strings for spacing
- Follow the component content order: schema → hooks → handlers → useEffect → return
