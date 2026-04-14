# Iconography Standard

> **Status:** NORMATIVE
> **Scope:** Visual iconography conventions for the lenguados documentation site. Applies to all pages rendered by Docusaurus, including custom components and MDX content.

Icons serve as **wayfinding aids** in the documentation site. They accelerate scanning, reinforce meaning, and create visual anchors — but only when applied with discipline. Misused icons add cognitive load instead of reducing it. This standard defines when, where, and how to use icons across the site.

## Library

The project uses **[Lucide React](https://lucide.dev/)** (`lucide-react`) as its sole icon library.

| Attribute     | Value                                                      |
| ------------- | ---------------------------------------------------------- |
| Package       | `lucide-react`                                             |
| License       | ISC (MIT-compatible)                                       |
| Style         | Stroke-based, 24x24 grid, flat/minimal                     |
| Tree-shaking  | `sideEffects: false` — only imported icons ship            |
| TypeScript    | Built-in declarations                                      |
| Bundle impact | ~499 bytes per icon (ESM); 15-20 icons add ~3-4 KB gzipped |

### Why Lucide

1. **Industry standard** — dominant React icon library by weekly downloads; default in shadcn/ui.
2. **Consistent visual language** — single-weight stroke icons on a uniform grid. No mixed styles.
3. **Minimal bundle** — per-icon ESM modules with perfect tree-shaking. Docusaurus eliminates unused icons automatically.
4. **Active maintenance** — monthly releases, explicit React 19 peer dependency.
5. **Feather successor** — inherits Feather Icons' minimal aesthetic with active development and 1,400+ additional icons.

### Prohibited alternatives

- **react-icons** — aggregator with no visual consistency across icon sets.
- **Feather Icons** — unmaintained predecessor to Lucide.
- **Font-based libraries** (Font Awesome webfonts, Material Icons font) — load the entire icon set regardless of usage; no tree-shaking.

## Color

Icons inherit their color from context via `currentColor` (Lucide's default). Explicit color overrides follow the project's CSS custom properties:

| Context                         | Color                  | Variable                   |
| ------------------------------- | ---------------------- | -------------------------- |
| Feature cards (decorative)      | Project green          | `var(--ifm-color-primary)` |
| Package cards (alongside links) | Project green          | `var(--ifm-color-primary)` |
| Primary CTA buttons             | White (inherited)      | `currentColor`             |
| Outline CTA buttons             | Green (inherited)      | `currentColor`             |
| Dark hero section               | White (inherited)      | `currentColor`             |
| Prose text (rare, inline)       | Text color (inherited) | `currentColor`             |

The accent orange (`var(--ifm-color-accent)`) is reserved for interactive emphasis (hover states, active indicators). Never use it as the default icon color — it competes with the primary brand identity.

Dark mode is handled automatically: `--ifm-color-primary` resolves to `#008000` in light mode and `#33c240` in dark mode. Icons using `currentColor` or CSS variables require no theme-specific overrides.

## Sizing

Three size tiers, applied consistently across the entire site:

| Tier       | Size    | Use                                                         |
| ---------- | ------- | ----------------------------------------------------------- |
| **Large**  | 32px    | Feature cards — visual anchor above the heading             |
| **Medium** | 20px    | Navbar items, section headings (when applicable)            |
| **Small**  | 16-18px | Inline with text: CTA buttons, package card headings, links |

Never introduce a fourth tier. If a new context arises, map it to the nearest existing tier.

## Stroke weight

All icons use `strokeWidth={1.75}` (slightly lighter than Lucide's default of 2). This reduces visual weight so icons complement headings and text without competing for attention. The lighter stroke matches the technical, precise tone of the documentation.

## Placement rules

### Where icons add value

| Location                  | Treatment                                     | Rationale                                                                                    |
| ------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Feature cards**         | 32px icon centered above the heading          | Creates an immediate visual anchor. The user identifies the concept before reading the title |
| **Package cards**         | 16-18px icon inline before the package name   | Differentiates packages visually. Creates per-package identity                               |
| **CTA buttons**           | 16-18px icon inline (leading or trailing)     | Reinforces the action. Standard in OSS landing pages                                         |
| **Navbar external links** | 20px icon replacing or accompanying the label | Convention for GitHub/external links. Every major OSS doc site does this                     |

### Where icons add noise

| Location                           | Why not                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| **Inside prose paragraphs**        | Disrupts reading flow. Technical prose relies on text clarity                                 |
| **Every heading or list item**     | Creates visual clutter. Headings have their own hierarchy via size/weight                     |
| **API signatures and code blocks** | Code is already visually distinct. Icons here are noise                                       |
| **Dense reference tables**         | Icons compete with data. Tables communicate through structure, not decoration                 |
| **Sidebar navigation**             | Docusaurus already provides expand/collapse chevrons. Additional icons make the nav feel busy |
| **Footer links**                   | The dark footer has adequate hierarchy. Icons here are decorative without function            |

### Density guideline

- A typical documentation page: **0 icons** in the content area. Text, code, and tables carry the information.
- Landing page / overview: **1 icon per card or feature block**. No more.
- Navigation chrome: icons only for external links (GitHub) and primary CTAs.
- Never use an icon as the **sole indicator of state or meaning** — always pair with text.

## Accessibility

All icons in this project are **decorative** (they accompany visible text). They carry `aria-hidden="true"`, which Lucide applies by default.

If a future icon must convey meaning without adjacent text (standalone icon button), it requires:

```tsx
<Search size={20} aria-label="Search documentation" role="img" />
```

Color contrast: icons must meet WCAG 2.1 AA (3:1 contrast ratio for non-text elements). The project's primary green (`#008000`) on white background achieves 5.14:1 — compliant. Dark mode green (`#33c240`) on `#1b1b1d` achieves 7.2:1 — compliant.

## Icon vocabulary

The following icons are assigned to specific concepts across the site. Use these consistently — never substitute a different icon for an established concept.

### Feature concepts

| Concept                       | Lucide icon | Import                                    |
| ----------------------------- | ----------- | ----------------------------------------- |
| Cross-platform / universality | `Globe`     | `import { Globe } from 'lucide-react'`    |
| Performance / speed           | `Zap`       | `import { Zap } from 'lucide-react'`      |
| Modularity / architecture     | `Blocks`    | `import { Blocks } from 'lucide-react'`   |
| Code-first / TypeScript       | `FileCode`  | `import { FileCode } from 'lucide-react'` |

### Package identity

| Package               | Lucide icon | Rationale                                          |
| --------------------- | ----------- | -------------------------------------------------- |
| `@lenguados/math2d`   | `Compass`   | Geometry/mathematics — specific to 2D spatial math |
| `@lenguados/common`   | `Wrench`    | Shared utilities/tools                             |
| `@lenguados/examples` | `Play`      | Interactive demos — invites exploration            |

### Actions

| Action                          | Lucide icon  | Position                            |
| ------------------------------- | ------------ | ----------------------------------- |
| Primary CTA ("Get Started")     | `ArrowRight` | Trailing (after text)               |
| Reference CTA ("API Reference") | `BookOpen`   | Leading (before text)               |
| External link (GitHub)          | `Github`     | Leading (before or replacing label) |

## Usage in code

### React component (TSX)

```tsx
import { Globe } from 'lucide-react';

// Decorative icon — default aria-hidden="true" applied by Lucide
<Globe size={32} strokeWidth={1.75} />

// Icon with explicit color via CSS variable
<Globe
 size={32}
 strokeWidth={1.75}
 style={{ color: 'var(--ifm-color-primary)' }}
/>

// Inline icon in a button
<Link className="button button--lg" to="/docs/intro">
 Get Started <ArrowRight size={18} strokeWidth={1.75} />
</Link>
```

### CSS class approach (for reuse)

When multiple icons share the same styling, define a CSS module class:

```css
.featureIcon {
 color: var(--ifm-color-primary);
 margin-bottom: 0.75rem;
}
```

```tsx
<Globe size={32} strokeWidth={1.75} className={styles.featureIcon} />
```

## Adding new icons

When a new page or component needs an icon:

1. **Check the vocabulary table** above. If the concept already has an assigned icon, use it.
2. **Search [lucide.dev/icons](https://lucide.dev/icons)** for candidates. Prefer icons whose metaphor is immediately recognizable without explanation.
3. **Apply the placement rules.** If the location falls under "where icons add noise," do not add the icon.
4. **Map to an existing size tier.** Never create a new size.
5. **Update this document** with the new entry in the appropriate vocabulary table.
6. **Use `strokeWidth={1.75}`** for consistency with existing icons.
