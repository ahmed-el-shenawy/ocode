# Quickstart: Visual Polish & Micro-interactions

## Implementation Steps

### 1. Create new UI components

| File | Purpose |
|------|---------|
| `craftcv/frontend/src/components/ui/Skeleton.tsx` | Reusable skeleton with variants (text/card/circle/rect) |
| `craftcv/frontend/src/components/ui/EmptyState.tsx` | Illustrated empty state with icon, title, description, action |
| `craftcv/frontend/src/components/ui/LoadingButton.tsx` | Button with built-in spinner + disabled state during async |

### 2. Wire up toast system

- Add `<Toaster richColors closeButton position="top-right" />` to root layout
- Import from `sonner`
- Use `toast.success()`, `toast.error()`, `toast()` in async handlers

### 3. Add animations to tailwind config

Extend `tailwind.config.ts`:
```
keyframes: { "fade-in": { ... } }
animation: { "fade-in": "fade-in 0.3s ease-out" }
```

Add `@keyframes fade-in` to `globals.css` in a `@layer utilities` block.

### 4. Update pages — loading + empty states

- Dashboard: Replace inline `animate-pulse` with `<Skeleton variant="card" />`
- Templates: Replace inline loading with `<Skeleton variant="rect" />`
- Template detail: Replace inline loading with `<Skeleton />`
- Studio: Add skeleton loaders while resume data loads
- Add `animate-fade-in` class to page containers

### 5. Add error states

- NetworkBanner: `navigator.onLine` listener with retry
- Auth forms: Add blur validation with inline error messages
- Studio: Improve error display for not-found resumes

### 6. Micro-interactions

- Buttons: `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
- Cards: `hover:shadow-lg hover:border-blue-200 transition-all duration-200`
- Sidebar: Left border `absolute` indicator on active item
- Inputs: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`
- Widget: `transition-colors duration-200` on selection border

## Files Modified (15)

See `plan.md` → Project Structure for full list.

## Running

```bash
cd craftcv
docker compose up -d --force-recreate frontend
```

## Verification

1. Navigate to dashboard → verify skeleton loaders appear briefly
2. Create a resume → verify toast notification appears
3. Disconnect network → verify offline banner appears
4. Hover over buttons/cards → verify subtle lift/shadow effects
5. Submit empty form → verify inline validation on blur
