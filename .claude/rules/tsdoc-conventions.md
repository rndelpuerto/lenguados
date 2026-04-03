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

## Prohibited Tags

Do not use: `@group`, `@alpha`, `@beta`, `@override` (not in project's ESLint allowed list)
