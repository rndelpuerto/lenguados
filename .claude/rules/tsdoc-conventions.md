---
paths:
 - 'packages/math2d/src/**/*.ts'
---

# TSDoc Conventions

Full reference: [TSDoc Standard](docs/docs/contributing/tsdoc-standard.md)

## Tag Order (enforced by ESLint `jsdoc/sort-tags`)

```
@packageDocumentation  (file headers only)
@file
@module
@description
@remarks
@template
@param
@returns
@throws
@defaultValue
@example
@see
@internal
@constant
@category
@since
@public
```

## @category Vocabulary (enforced by ESLint `enforce-category-vocabulary`)

**Base categories (any file):** `Constant`, `Factory`, `Arithmetic`, `Computed`, `Transform`, `Interpolation`, `Comparison`, `Mutator`, `Accessor`, `Conversion`

**Type-specific (scoped to designated files):**

- `Matrix Operations`, `Column/Row` — matrix2.ts, matrix3.ts only
- `Set Operations` — interval.ts only
- `Transform Integration` — vector2.ts, transform2.ts only
- `Direction`, `Geometry`, `Constraint` — vector2.ts only

**Auxiliary:** `Safety`, `Wrapping`, `Guards`, `Normalization`
**Constants:** `Tolerance`, `Angular`, `Mathematical`, `Numeric Limits`, `Collection`
**Structural:** `Core`, `Types`, `Helpers`, `Configuration`, `Assertion`

**Deprecated categories** (replace with suggested alternative):

- `Geometry & Measures` → `Computed` or `Geometry`
- `Direction & Angles` → `Direction` or `Computed`
- `Predicate` → `Comparison`
- `Serialization` → `Conversion`
- `Component` → `Accessor`

## Text Conventions

- **Summary line**: imperative voice, sentence fragment, no trailing period
  - Good: `Compute the dot product of two vectors`
  - Bad: `Computes the dot product.` / `This method computes the dot product`
- **@param**: `@param name - Description` (hyphen separator, no type annotation)
- **@returns**: `@returns Description` (sentence fragment)
- **@throws**: `@throws {ErrorType} Condition`
- **Formulas**: Unicode symbols permitted (→ ← × ÷ θ π ∞ ≤ ≥ ≠). LaTeX prohibited.
- **@example**: fenced code block with `typescript` language tag

## Triality Cross-Linking

Every strict/safe/unchecked variant MUST include `@see` linking to its siblings:

```typescript
/** @see {@link divideSafe} - returns 0 instead of throwing
 *  @see {@link divideUnchecked} - no validation, for hot paths */
divide() { ... }

/** @see {@link divide} - strict variant that throws */
divideSafe() { ... }

/** @see {@link divide} - strict variant that throws
 *  @see {@link divideSafe} - safe variant with fallback */
divideUnchecked() { ... }
```

## Class Member Section Ordering

Organize class bodies following ESLint `@typescript-eslint/member-ordering` (two groups, `as-written` within each):

**Group 1 (declarations — must precede all instance methods):**

1. Private helpers (`ensureOut`, `normalizeComponents`)
2. Static constants (`ZERO`, `ONE`, `IDENTITY`, `ELEMENT_COUNT`)
3. Static factories (`from*`)
4. Static arithmetic / transform / computed / comparison
5. Instance properties
6. Constructor

**Group 2 (instance members):** 7. Instance mutators (arithmetic, transform, normalization) 8. Instance accessors (getters, computed properties) 9. Instance conversion (`to*`, `clone`, `copy`, `equals`)

## @since Version Resolution

The `@since` tag records the first release version that contains a symbol. When adding or updating `@since` tags, follow these rules:

**How to determine the correct version:**

1. Read the current stable version from `packages/math2d/package.json` → `version` field (managed by Lerna).
2. The `@since` version for any **new** symbol is the **next semver release** after that stable version.
   - Example: if `package.json` says `0.6.0`, new symbols get `@since 0.7.0`.
   - Example: if `package.json` says `1.2.0`, new symbols get `@since 1.3.0`.
3. Never guess or invent version numbers beyond the next release. Do not use placeholder versions like `0.8.0`, `0.9.0`, `1.0.0` for unreleased work.

**When does a symbol get a new `@since`?**

- **New symbol** (method, constant, class, type, export): next release version.
- **Renamed symbol** (same concept, different name): inherits the `@since` of the predecessor. The rename is documented in `CHANGELOG.md`, not in `@since`.
- **Refactored symbol** (same name, same concept, internal rewrite): keeps its original `@since`. Internal changes do not change the introduction version.
- **Drastically changed behavior** (same name, breaking semantic change): gets the next release version, because the API contract changed from the consumer's perspective. Document the behavioral change in `CHANGELOG.md`.

**What NOT to do:**

- Do not assign `@since` versions higher than the next release after the current stable.
- Do not use `@since` to reference a planned future version (e.g., "will be in 1.0.0").
- Do not omit `@since` on public exports — it is required per the TSDoc standard.
- Do not change `@since` on existing symbols during unrelated edits.

**Verification:** Run `node -e "console.log(require('./packages/math2d/package.json').version)"` to confirm the current stable version before assigning `@since` tags.

## Prohibited Tags

Do not use: `@group`, `@alpha`, `@beta`, `@override` (not in project's ESLint allowed list)
