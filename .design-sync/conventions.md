# Building with @balena/ui-shared-components

## Required app wrapper

Every screen must be wrapped in this provider chain (outermost first) or components will render unthemed — and any `*WithTracking` component will **throw** (`useAnalyticsContext must be used within a ContextProvider`):

```jsx
const { AnalyticsContextProvider, Material, theme } = window.BalenaUiSharedComponents;
const { ThemeProvider, ScopedCssBaseline } = Material;

<AnalyticsContextProvider>
  <ThemeProvider theme={theme}>
    <ScopedCssBaseline>
      {/* your app */}
    </ScopedCssBaseline>
  </ThemeProvider>
</AnalyticsContextProvider>
```

Components that navigate (`RouterLinkWithTracking`) also need a react-router `BrowserRouter`/`MemoryRouter` ancestor (`BrowserRouter` is available on the same global). Toasts via `enqueueSnackbar` need `SnackbarProvider` mounted once.

## Styling idiom: MUI `sx` props + balena design tokens — no CSS classes

This is an MUI (emotion) system. Style your own layout glue with MUI primitives from the `Material` namespace (`Box`, `Stack`, `Typography`, `Grid`) and `sx` props — never invent CSS class names; there is no utility-class vocabulary.

Colors, spacing, and type come from balena's design tokens, exposed two ways:

- CSS custom properties (defined in `tokens/tokens.css`, loaded via `styles.css`): `var(--color-bg)`, `var(--color-bg-subtlest)`, `var(--color-text)`, `var(--color-text-accent)`, `var(--color-border-info)`, `var(--color-bg-danger-strong)`, `var(--spacing-2)`, `var(--shape-border-radius-sm)`, `var(--typography-font-family-body)` — families: `--color-*` (bg/text/border/icon/status + `palette-{blue,green,red,orange,teal,purple,yellow,neutral}`), `--spacing-0…6`, `--shape-*`, `--typography-*`.
- The `token()` helper (a top-level export): `token('color.bg.subtlest')` → the CSS var reference for the same token; component sources use it inside `sx`/styled.

Typography: body text is **Source Sans Pro**, code is **Ubuntu Mono** (loaded by `styles.css` from Google Fonts). Use `Typography` variants rather than raw font sizes.

## Where the truth lives

- `styles.css` → imports `tokens/tokens.css` (the full token list — read it before picking colors) and `_ds_bundle.css`.
- Per-component API: `components/<group>/<Name>/<Name>.d.ts` (props) and `<Name>.prompt.md` (usage).
- Whole MUI v7 ships on the global as namespaces: `Material` (`@mui/material`), `MaterialLab`, `MaterialDataGrid` (`@mui/x-data-grid`), `XDatePickers`; plus `ReactQuery` (`@tanstack/react-query`) and `dayjs`. Prefer the DS's own components (`Callout`, `Tag`, `Chip`, `Spinner`, `DropDownButton`, `RJST` for data tables, `RJSForm` for schema-driven forms) over raw MUI when one exists.

## Idiomatic example

```jsx
const { AnalyticsContextProvider, Material, theme, Callout, Tag, ButtonWithTracking } =
  window.BalenaUiSharedComponents;
const { ThemeProvider, ScopedCssBaseline, Stack, Typography } = Material;

<AnalyticsContextProvider>
  <ThemeProvider theme={theme}>
    <ScopedCssBaseline>
      <Stack spacing={2} sx={{ p: 3, backgroundColor: 'var(--color-bg-subtlest)' }}>
        <Typography variant="h5">Device fleet</Typography>
        <Callout severity="info">All devices are online.</Callout>
        <Stack direction="row" spacing={1}>
          <Tag name="env" value="production" />
          <ButtonWithTracking eventName="deploy click" variant="contained">Deploy</ButtonWithTracking>
        </Stack>
      </Stack>
    </ScopedCssBaseline>
  </ThemeProvider>
</AnalyticsContextProvider>
```
