# Frontend Design System & Guidelines

## 1. Design Principles
- Clarity: every screen must communicate its purpose clearly through visual hierarchy, spacing, and text.
- Consistency: use a shared color palette, typography scale, and component behavior across pages.
- Efficiency: keep interactions direct and reduce the number of clicks needed to complete key tasks.
- Accessibility: aim for readable content, keyboard operability, and sufficient contrast.
- Responsiveness: design mobile-first and ensure every interface adapts smoothly from phone to desktop.

## 2. Design Tokens

### Colors
Primary scale:
- `primary-50`  — #eef2ff
- `primary-100` — #e0e7ff
- `primary-200` — #c7d2fe
- `primary-300` — #a5b4fc
- `primary-400` — #818cf8
- `primary-500` — #6366f1
- `primary-600` — #4f46e5
- `primary-700` — #4338ca
- `primary-800` — #3730a3
- `primary-900` — #312e81

Neutral scale:
- `neutral-50`  — #f8fafc
- `neutral-100` — #f1f5f9
- `neutral-200` — #e2e8f0
- `neutral-300` — #cbd5e1
- `neutral-400` — #94a3b8
- `neutral-500` — #64748b
- `neutral-600` — #475569
- `neutral-700` — #334155
- `neutral-800` — #1e293b
- `neutral-900` — #0f172a

Semantic colors:
- `success` — #16a34a
- `warning` — #eab308
- `error` — #dc2626
- `info` — #0ea5e9

Usage rules:
- Primary scale is for primary buttons, links, brand accents, and active states.
- Neutral scale is for backgrounds, borders, text, and surfaces.
- Semantic colors are for alerts, status labels, badges, and icon states.
- Reserve the darkest neutral tones for body text and the lightest neutral tones for page backgrounds.

### Typography
Font families:
- Sans-serif: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

Font sizes:
- `text-xs`   — 0.75rem
- `text-sm`   — 0.875rem
- `text-base` — 1rem
- `text-lg`   — 1.125rem
- `text-xl`   — 1.25rem
- `text-2xl`  — 1.5rem
- `text-3xl`  — 1.875rem
- `text-4xl`  — 2.25rem

Font weights:
- `font-light`  — 300
- `font-normal` — 400
- `font-medium` — 500
- `font-semibold` — 600
- `font-bold`  — 700

Line heights:
- `leading-none` — 1
- `leading-tight` — 1.25
- `leading-snug` — 1.375
- `leading-normal` — 1.5
- `leading-relaxed` — 1.75

Usage rules:
- Headings use `font-semibold` or `font-bold` with larger sizes.
- Body copy uses `text-base` or `text-sm` with `leading-normal`.
- UI labels and helper text use `text-sm` or `text-xs` with `font-medium` for clarity.

### Spacing Scale
- `spacing-1` — 4px
- `spacing-2` — 8px
- `spacing-3` — 12px
- `spacing-4` — 16px
- `spacing-5` — 20px
- `spacing-6` — 24px
- `spacing-7` — 28px
- `spacing-8` — 32px
- `spacing-9` — 36px
- `spacing-10` — 40px
- `spacing-11` — 44px
- `spacing-12` — 48px
- `spacing-13` — 52px
- `spacing-14` — 56px
- `spacing-15` — 60px
- `spacing-16` — 64px

Usage rules:
- Component padding: use `spacing-4` / `spacing-5` for cards and sections.
- Section spacing: use `spacing-8` / `spacing-10` between major page sections.
- Small gaps between form fields: `spacing-3` / `spacing-4`.
- Large container padding: `spacing-12` / `spacing-16` on desktop.

### Border Radius
- `rounded-none` — 0px
- `rounded-sm` — 4px
- `rounded` — 8px
- `rounded-md` — 12px
- `rounded-lg` — 16px
- `rounded-xl` — 24px
- `rounded-full` — 9999px

Usage rules:
- Cards and panels use `rounded-lg`.
- Buttons use `rounded` or `rounded-full` for pill-style actions.
- Inputs and dropdowns use `rounded-md`.
- Avatars/icons use `rounded-full`.

### Shadows
- `shadow-sm` — 0 1px 2px rgba(15, 23, 42, 0.08)
- `shadow` — 0 4px 12px rgba(15, 23, 42, 0.08)
- `shadow-md` — 0 8px 24px rgba(15, 23, 42, 0.12)
- `shadow-lg` — 0 16px 48px rgba(15, 23, 42, 0.12)
- `shadow-xl` — 0 24px 80px rgba(15, 23, 42, 0.16)

Usage rules:
- Use `shadow-sm` for subtle input focus or card depth.
- Use `shadow` / `shadow-md` for elevated surfaces.
- Reserve `shadow-lg`/`shadow-xl` for modals and overlay surfaces only.

## 3. Layout System

### Grid
- Container max-width:
  - `max-w-screen-xl` — 1280px
  - `max-w-screen-2xl` — 1536px
- Columns: 12-column grid for layout sections.
- Gutters: 24px default gutter (`spacing-6`).

### Responsive breakpoints
- `sm` — 640px
- `md` — 768px
- `lg` — 1024px
- `xl` — 1280px

### Common layout patterns
- Centered page wrapper:
  ```html
  <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <!-- page content -->
  </div>
  ```
- Two-column split:
  ```html
  <div class="grid gap-6 lg:grid-cols-2">
    <div><!-- primary content --></div>
    <div><!-- sidebar / quick actions --></div>
  </div>
  ```
- Full-width hero:
  ```html
  <section class="relative overflow-hidden bg-neutral-900 text-white">
    <div class="mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8">
      <!-- hero content -->
    </div>
  </section>
  ```

## 4. Component Library

### Button
All variants:
- Primary: `inline-flex items-center justify-center rounded px-5 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500`
- Secondary: `inline-flex items-center justify-center rounded px-5 py-3 text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500`
- Outline: `inline-flex items-center justify-center rounded border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500`
- Ghost: `inline-flex items-center justify-center rounded px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500`
- Danger: `inline-flex items-center justify-center rounded px-5 py-3 text-sm font-semibold text-white bg-error hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-error`

Sizes:
- Small: `px-3 py-2 text-xs`
- Medium: `px-4 py-3 text-sm`
- Large: `px-6 py-4 text-base`

States:
- Default: base styling
- Hover: slightly darker background and elevated state
- Focus: `focus:outline-none focus:ring-2 focus:ring-offset-2`
- Disabled: `opacity-50 cursor-not-allowed` and remove pointer events
- Loading:
  ```html
  <button class="inline-flex items-center justify-center rounded bg-primary-600 px-5 py-3 text-sm font-semibold text-white opacity-80 cursor-wait" disabled>
    <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    Loading
  </button>
  ```

Usage rules:
- Primary for main CTAs, secondary for less important actions.
- Outline for neutral actions or secondary navigation.
- Ghost for inline actions and icon-only buttons.
- Danger only for destructive or irreversible actions.

### Input Fields
Types:
- Text/email/password:
  ```html
  <label class="mb-2 block text-sm font-medium text-neutral-800" for="email">Email</label>
  <input id="email" type="email" class="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
  ```
- Textarea:
  ```html
  <label class="mb-2 block text-sm font-medium text-neutral-800" for="message">Message</label>
  <textarea id="message" rows="4" class="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"></textarea>
  ```

States:
- Default: neutral border and white background.
- Focus: `border-primary-500 focus:ring-primary-100`.
- Error: `border-error text-error placeholder:text-error/70`.
- Success: `border-success text-success`.
- Disabled: `bg-neutral-100 text-neutral-500 cursor-not-allowed`.

Label + helper text + error:
- Label: `text-sm font-medium text-neutral-800`
- Helper text: `mt-1 text-xs text-neutral-500`
- Error message: `mt-1 text-xs font-medium text-error`

### Cards
Default:
```html
<div class="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
  <div class="p-6">
    <!-- card content -->
  </div>
</div>
```
Hover state:
```html
<div class="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow transition hover:shadow-md">
```
With image:
```html
<div class="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
  <img src="..." alt="" class="w-full object-cover" />
  <div class="p-6">...</div>
</div>
```
With actions:
```html
<div class="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
  <div class="p-6">...</div>
  <div class="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-right">
    <button class="inline-flex items-center rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Action</button>
  </div>
</div>
```

### Modals
Structure:
```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">
    <div class="border-b border-neutral-200 px-6 py-4">
      <h2 class="text-lg font-semibold text-neutral-900">Modal title</h2>
    </div>
    <div class="p-6">Modal content</div>
    <div class="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4">
      <button class="rounded bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">Cancel</button>
      <button class="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
    </div>
  </div>
</div>
```
Overlay: `bg-black/50`.
Animations:
- Enter: `transition-transform duration-200 ease-out transform opacity-0 scale-95`
- Active: `opacity-100 scale-100`
- Leave: `opacity-0 scale-95`
Close behavior:
- Close on overlay click.
- Close on `Escape`.
- Focus trapped inside modal.

### Alerts / Toasts
Variants:
- Success: `rounded-md bg-success/10 border border-success/20 p-4 text-sm text-success`
- Warning: `rounded-md bg-warning/10 border border-warning/20 p-4 text-sm text-warning`
- Error: `rounded-md bg-error/10 border border-error/20 p-4 text-sm text-error`
- Info: `rounded-md bg-info/10 border border-info/20 p-4 text-sm text-info`

### Loading States
Skeleton:
```html
<div class="space-y-3">
  <div class="h-4 w-3/4 rounded bg-neutral-200"></div>
  <div class="h-4 rounded bg-neutral-200"></div>
  <div class="h-4 w-5/6 rounded bg-neutral-200"></div>
</div>
```
Spinner:
```html
<div class="inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
```

### Empty States
Pattern:
```html
<div class="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
  <div class="mx-auto mb-4 h-12 w-12 rounded-full bg-primary-100 text-primary-700 grid place-items-center">!</div>
  <h3 class="mb-2 text-lg font-semibold text-neutral-900">No items yet</h3>
  <p class="mb-4 text-sm text-neutral-500">Add your first item to get started.</p>
  <button class="inline-flex rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Create item</button>
</div>
```

## 5. Accessibility Guidelines
- Target WCAG 2.1 Level AA.
- Ensure text contrast of at least 4.5:1 for body text and 3:1 for large text.
- Provide meaningful alt text for images and icons.
- Keyboard navigation:
  - All interactive elements must be reachable via `Tab`.
  - Buttons and links should have visible focus states.
- Focus indicator styling:
  - `outline: 2px solid #2563eb; outline-offset: 2px;` or equivalent.
- ARIA requirements:
  - Use `aria-label` on icon-only buttons.
  - Use `role="alert"` for critical form errors.
  - Use `aria-modal="true"` and `aria-labelledby`/`aria-describedby` for modals.

## 6. Animation Guidelines
- Default transition duration: `200ms`.
- Easing:
  - Standard: `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Entrance: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate only opacity and transform for performance.
- Use motion sparingly: avoid animating layout-critical properties like width/height.
- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

## 7. Icon System
- Recommended library: `Lucide React`.
- Use icons consistently at sizes:
  - 16px for small labels and metadata.
  - 20px for buttons and inline actions.
  - 24px for cards, hero actions, and section headers.
- Usage patterns:
  - Use icons only when they add meaning.
  - Prefer text labels alongside icons for primary actions.
  - Use icon-only buttons only when the action is obvious.

## 8. Responsive Design
- Mobile-first approach: build from smallest screen upward.
- Touch target minimum: 44×44px for buttons and interactive controls.
- Component adaptation:
  - Buttons and inputs expand to full width on small screens.
  - Sidebar navigation collapses into a drawer or hamburger menu on `sm`/`md` breakpoints.
  - Tables become responsive with horizontal scrolling or stacked content.
  - Hero CTA buttons stack vertically on mobile.
- Use responsive utilities to adjust padding and layout at each breakpoint.
