---
paths:
 - '**/*.md'
---

# Documentation Conventions

## File Placement

### Package root (`packages/math2d/`)

Only these markdown files:

- `README.md` -- npm storefront
- `CHANGELOG.md` -- version history (Lerna-managed)
- `ARCHITECTURE.md` -- concise code map (matklad convention, under 200 lines)

No `docs/` directory inside packages. No other `.md` files.

### Monorepo root (`/`)

- `README.md` -- landing page
- `CHANGELOG.md` -- monorepo changelog
- `CONTRIBUTING.md` -- workflow + math2d API conventions
- `ARCHITECTURE.md` -- monorepo topology (30-60 lines, links to package ARCHITECTURE.md)
- `LICENSE` -- Apache 2.0

### Docs site (`docs/docs/`)

- `math2d/` -- package deep-dives (architecture axioms, interoperability, edge cases, design decisions)
- `contributing/` -- contributor guides (TSDoc standard, testing strategy, design philosophy)
- `api/` -- auto-generated TypeDoc (do not edit manually)

## ARCHITECTURE.md Two-Level Convention

- Root: monorepo topology, package relationships, shared infrastructure. 30-60 lines. Points to package file.
- Package: internal code map, layer diagram, key patterns, conventions. Under 200 lines. Points to docs site for expanded content.

## Language

- All documentation in English
- Spanish quotes may be preserved as blockquotes with English translation following

## Linking Rules

- **Package README** → external files: absolute GitHub URLs (`https://github.com/rndelpuerto/lenguados/blob/main/...`). Required because npm renders README.md and relative links break on npmjs.org.
- **Package README** → same-directory files (ARCHITECTURE.md, CHANGELOG.md): relative paths OK.
- **Root files** → repo files: relative paths (`packages/math2d/README.md`).
- **Docusaurus pages** → other docs pages: relative paths without `.md` extension.

## Docusaurus Frontmatter

Every page in `docs/docs/` requires:

```yaml
---
sidebar_position: N
title: 'Page Title'
description: 'One-line description'
---
```

## Formatting

- No emojis in H1/H2/H3 headers
- Use plain text headers for accessibility and grep-friendliness

## Temporary Documentation

- Use branches + draft PRs for work-in-progress docs
- No `drafts/`, `wip/`, or temporary directories in the repo
- Use `draft: true` frontmatter in Docusaurus to hide from production

## Edge Case Documentation

When documenting operations with failure modes:

- Document the IEEE 754 behavior (underflow, NaN propagation, Infinity)
- Reference the recommended `*Safe` variant for each failure scenario
- Follow the patterns established in `docs/docs/math2d/edge-cases.md`

## Interoperability & Type Escalation

When documenting type conversions:

- Document when escalation is needed (e.g., Transform2 → Matrix3 for shear)
- Document precision implications (e.g., Rotation2 drift requiring periodic `.normalize()`)
- Include `@see` links between related conversion methods

## API Reference Accuracy

When referencing math2d API names in documentation:

- Verify the method/class name exists in the current codebase before using it
- Known renames: `.scale()` → `.multiplyScalar()`, `safeDivide` → `divideSafe` (suffix convention)
- When in doubt, grep the source before documenting

## Version References

When any documentation (`.md`, TSDoc, specs) mentions a library version:

- The maximum allowable version is the **next semver release** after the current stable in `packages/math2d/package.json`.
- Never reference speculative future versions (e.g., "will be removed in 1.0.0") — use "a future major version" instead.
- Full version resolution rules for `@since` tags are in `.claude/rules/tsdoc-conventions.md` → **@since Version Resolution**.

## TSDoc

- Follow the [TSDoc Standard](docs/docs/contributing/tsdoc-standard.md) for all source code documentation
- TSDoc-specific rules for AI in `.claude/rules/tsdoc-conventions.md`
