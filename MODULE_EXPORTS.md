# Module Exports & Internals

> **Status:** NORMATIVE
> **Scope:** How packages in the lenguados engine structure, classify, and expose their modules through the `exports` field, subpath patterns, and the `module-internals.json` convention.

Every package in the engine follows a unified system for deciding what to expose and how. This document defines the classification framework, the build mechanics, and the criteria that drive each decision.

---

## 1. The Problem This Solves

A package is more than a single entry point. It contains core functionality, optional tools, configuration utilities, and implementation details. Exposing everything through a single barrel creates three problems:

1. **Bundle bloat** — consumers import a few functions but the bundler must parse the entire module.
2. **Autocomplete noise** — configuration functions appear alongside core operations.
3. **Unclear boundaries** — consumers cannot tell which functions are core to the package and which are supplementary.

The solution is a layered export strategy where each module is classified by its relationship to the package's identity.

---

## 2. Classification Framework

Every module in a package falls into one of four categories. These are exhaustive and mutually exclusive.

### Option 1 — Barrel

The module is part of the package's **primary identity**. Its exports are available from the root import path.

```typescript
import { CoreType, utilityFn } from '@lenguados/<package>';
```

**Criteria:**

- The module defines what the package IS
- Its symbols are used in the majority of consumer code
- A consumer who imports the package expects these symbols to be available
- Removing them would make the package incomplete

**Build:** Barrel modules are re-exported from the root `index.ts`. They are bundled into the main entry point. No separate build artifact is produced.

### Option 2 — Internal

The module provides **supplementary functionality** that does not belong to the package's primary identity. It is accessed through a dedicated subpath import.

```typescript
import { supplementaryFn } from '@lenguados/<package>/utils/module-name';
```

**Criteria:**

- The module serves a different use case than the package's core purpose
- A typical consumer does not need it for the primary workflow
- It benefits from being independently importable (tree-shaking, semantic clarity)
- It is stable enough to be part of the public API

**Build:** Internal modules are registered in `module-internals.json`, compiled as separate entry points by Rollup, and listed as subpath exports in `package.json`.

### Option 3 — Hybrid

A single source module is **split** between the barrel and an internal. Some of its exports belong to the barrel (primary workflow), while others belong to an internal (specialized use case).

```typescript
// From the barrel — symbols used in the primary workflow
import { primaryFn, validateFn } from '@lenguados/<package>';

// From the internal — symbols for a specialized scenario
import { boundaryValidateFn } from '@lenguados/<package>/validation/shapes';
```

**Criteria:**

- The source module contains symbols that serve **two distinct purposes**
- One subset is tightly coupled with the package's core types (co-imported naturally)
- The other subset serves a specialized scenario (boundary validation, configuration aggregation)
- The split is **clean and disjoint** — each symbol has one canonical import path

**Build:** The barrel re-exports the primary subset from the source module. A thin re-export file surfaces the specialized subset as a separate entry point, registered in `module-internals.json`.

### Option 4 — Hidden

The module is a **private implementation detail**. It is not part of the public API and cannot be imported by consumers.

**Criteria:**

- The module is an internal algorithm, helper function, or implementation artifact
- Exposing it would create a maintenance burden with no consumer benefit
- It is marked with `@internal` in TSDoc

**Build:** Hidden modules are not exported, not registered in `module-internals.json`, and excluded from generated API documentation.

---

## 3. Decision Criteria

When classifying a module, apply these tests in order.

### Test 1 — Identity

> Does this module define what the package IS?

If the module contains the core types, fundamental operations, or essential primitives that give the package its purpose, it belongs in the barrel. Consumers expect these symbols when they install the package.

### Test 2 — Co-import

> Is this symbol naturally imported alongside core types?

If a developer who imports the package's primary types would typically import this symbol in the same statement, it belongs in the barrel. If the symbol serves a different workflow or scenario, it belongs in an internal.

### Test 3 — Intra-package consumption

> Does the package itself depend on this symbol?

If the symbol is used by other modules within the package, it has stronger affinity with the barrel. If it has zero intra-package usage, it is a weaker barrel candidate.

### Test 4 — Semantic path

> Does the subpath import communicate the developer's intent better than the barrel?

If `import { x } from '@pkg/validation/shapes'` tells a reader more about what the developer is doing than `import { x } from '@pkg'`, the internal path adds value.

### Test 5 — State coherence

> Does this symbol read or write shared module state?

If a symbol controls behavior of other symbols through shared state (e.g., a configuration toggle that affects function behavior), it **must** live in the same bundle as the symbols it affects. Separate bundles produce separate module instances with independent state.

---

## 4. Build Mechanics

### Entry Points

Each package has one mandatory entry point (`index.ts`) and zero or more internal entry points. The build system produces three output formats per entry point:

| Format     | Directory     | Pattern                               | Purpose             |
| ---------- | ------------- | ------------------------------------- | ------------------- |
| CommonJS   | `lib/cjs/`    | `*.development.js`, `*.production.js` | Node.js `require()` |
| ES Module  | `lib/esm/`    | `*.development.js`, `*.production.js` | Bundler `import`    |
| TypeScript | `lib/@types/` | `*.d.ts`                              | Type declarations   |

### The `module-internals.json` Convention

Each package root contains a `module-internals.json` file that lists internal entry points. Items can be either **directory names** or **specific file paths**:

```json
["subdir/entry.ts", "utils"]
```

- **Directory entry** (e.g., `"utils"`): Rollup discovers all `.ts` files in the directory (excluding test files). Each file becomes a separate entry point.
- **File entry** (e.g., `"subdir/entry.ts"`): Rollup uses the file directly as a single entry point.

### The `package.json` Exports Field

Every subpath export follows this structure. The order is significant — `types` must precede `default` for TypeScript resolution:

```json
{
 "./subpath/name": {
  "types": "./lib/@types/subpath/name.d.ts",
  "development": {
   "require": "./lib/cjs/subpath/name.development.js",
   "import": "./lib/esm/subpath/name.development.js"
  },
  "default": {
   "require": "./lib/cjs/subpath/name.production.js",
   "import": "./lib/esm/subpath/name.production.js"
  }
 }
}
```

The `development` condition activates in dev builds (assertions active, source maps, unminified). The `default` condition activates in production (assertions stripped via DCE, minified).

### Three-File Entry Point Convention

Every package includes three root-level entry files that bridge CJS and ESM consumers:

| File           | Purpose                                   | Module System |
| -------------- | ----------------------------------------- | ------------- |
| `main.js`      | Runtime `NODE_ENV` detection for CJS      | CommonJS      |
| `main.mjs`     | Production ESM entry                      | ES Module     |
| `dev-main.mjs` | Development ESM entry (assertions active) | ES Module     |

CJS uses a single file with a runtime `if/else` on `process.env.NODE_ENV` because `require()` is evaluated at runtime. ESM uses two separate files because `import` statements are statically analyzed — bundlers resolve the correct file at build time through the `development` and `default` conditions in the `exports` field.

For the full build configuration and `package.json` field requirements, see `rollup.config.mjs`.

---

## 5. Development vs Production Builds

The engine uses a compile-time constant (`__LENGUADOS_DEV__`) to enable Dead Code Elimination (DCE). This constant is injected by SWC during the Rollup build via global variable replacement:

- **Development** (`NODE_ENV=development`): `__LENGUADOS_DEV__` resolves to `true`. Assertions are active. Source maps are generated. Bundles are unminified.
- **Production** (`NODE_ENV=production`): `__LENGUADOS_DEV__` resolves to `false`. Minifiers remove all assertion code. Zero runtime overhead.

This means barrel-exported assertions add **zero bytes** to the production bundle. The classification decision for assertions is based on developer experience and semantic clarity, not on bundle impact.

---

## 6. Adding a New Internal Module

Follow this workflow when a module needs its own subpath export.

**Step 1 — Classify the module.** Apply the decision criteria from Section 3. Determine whether the module is fully internal (Option 2) or hybrid (Option 3).

**Step 2 — Create the entry file.** For Option 2, the source file itself is the entry point. For Option 3, create a thin re-export file that surfaces only the internal-specific symbols:

```typescript
// src/<subdir>/internals.ts — thin re-export for the internal subpath
export { specializedFnA, specializedFnB } from './source'; // resolves to the full source module in the same directory
```

**Step 3 — Register in `module-internals.json`.** Add the directory name or specific file path:

```json
["<subdir>/internals.ts", "utils"]
```

**Step 4 — Add the subpath export to `package.json`.** Follow the types → development → default structure from Section 4.

**Step 5 — Rebuild.** Rollup discovers the new entry point automatically. Verify the output in `lib/`.

---

## 7. Conventions

### Naming

- Internal subpath names reflect **what the module contains**, not the source file it derives from
- Directory-based internals use the directory name as the subpath prefix: `./utils/module-a`, `./utils/module-b`
- File-based internals use a descriptive name: `./validation/shapes` (not `./validation/assert-internals`), `./config/advanced` (not `./config/config-extra`)

### Documentation

- Every internal entry file must have a `@module` TSDoc tag with the full import path (see [TSDoc Standard](TSDOC_STANDARD.md) for tag conventions)
- The main barrel's `@packageDocumentation` block must list all available internals with example imports
- Each internal's TSDoc should cross-reference related barrel symbols via `@see`

### Tree-Shaking

- All packages must declare `"sideEffects": false` in `package.json`
- Internal modules must not produce side effects at import time
- The barrel re-exports only what it needs — unused source symbols are excluded from the barrel bundle

### What NOT to Make Internal

- Symbols that would be better as a separate package (I/O, rendering, domain-specific algorithms)
- Symbols too unstable for the public API — use `@internal` (Option 4) until stable
- Convenience wrappers that compose barrel symbols in one expression — these add maintenance cost without consumer benefit

---

Each package documents its specific classification decisions and the rationale behind them. See each package's `module-internals.json` for its registered internals and `package.json` `exports` field for the complete subpath map.
