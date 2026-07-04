# TSDoc Standard

> **Status:** NORMATIVE
> **Scope:** TSDoc documentation conventions for all packages in the lenguados engine.

Every source file across all packages SHALL conform to this standard. Individual packages MAY extend it with package-specific categories, templates, or member ordering rules.

---

## 1. Canonical Tag Order

All TSDoc blocks SHALL follow this fixed order. Only tags present in a given block need appear — but those that do SHALL respect this sequence:

| #   | Tag                     | Scope                     | Purpose                                      |
| --- | ----------------------- | ------------------------- | -------------------------------------------- |
| 1   | _(summary)_             | All                       | First line, no tag prefix                    |
| 2   | `@packageDocumentation` | Package entry file only   | Marks the main barrel's documentation block  |
| 3   | `@file`                 | File headers only         | Relative path from `src/`                    |
| 4   | `@module`               | File headers only         | Full NPM module path                         |
| 5   | `@description`          | File headers only         | One-sentence purpose                         |
| 6   | `@remarks`              | Where needed              | Details, design context, edge cases          |
| 7   | `@template`             | Generic functions/classes | One per type parameter, in declaration order |
| 8   | `@param`                | Functions/methods         | One per parameter, in signature order        |
| 9   | `@returns`              | Functions/methods         | Return value description                     |
| 10  | `@throws`               | Fallible functions        | Error type and condition                     |
| 11  | `@defaultValue`         | Optional params           | Default value when inline is unclear         |
| 12  | `@example`              | Most public symbols       | Usage demonstrations                         |
| 13  | `@see`                  | Cross-references          | Links to related symbols                     |
| 14  | `@internal`             | Private helpers           | Marks non-public API                         |
| 15  | `@constant`             | Constants                 | Type annotation for constants                |
| 16  | `@category`             | Public exports            | TypeDoc grouping (controlled vocabulary)     |
| 17  | `@since`                | Public exports            | First version containing this symbol         |
| 18  | `@public`               | Overrides only            | Explicit public visibility                   |

---

## 2. Core Templates

### File Header

Every `.ts` source file SHALL start with:

```typescript
/**
 * @file layer/module/filename.ts
 * @module @lenguados/<package>/layer/module
 * @description One-sentence purpose of this file
 */
```

### Exported Function

````typescript
/**
 * Present-tense third-person summary of what the function does.
 * @param name - Sentence fragment, no trailing period
 * @returns Sentence fragment describing return value
 *
 * @example
 * ```typescript
 * functionName(normalInput);    // expected output
 * functionName(edgeCase);       // edge case output
 * ```
 *
 * @category CategoryName
 * @since X.Y.Z
 */
````

### Triality (Strict / Safe / Unchecked)

Every fallible operation with the triality pattern SHALL document:

- **Strict variant**: `@throws` required, `@see` to Safe + Unchecked, `@example` shows throw case
- **Safe variant**: summary includes fallback, `@see` to Strict only, NO `@throws`
- **Unchecked variant**: bold `**Precondition:**` in `@remarks`, `@see` to Strict + Safe, NO `@example`

### Class

```typescript
/**
 * One-sentence description of the type and its purpose.
 *
 * @remarks
 * - **Design:** Instance vs static behavior description.
 * - **Numerics:** Determinism or precision characteristics.
 * - **Safety:** Availability of safe variants.
 *
 * @category Core
 * @since X.Y.Z
 */
```

### Interface (`*Like`)

Minimal summary — one sentence. `@category Types`. Readonly and Mutable as a pair.

### `@internal` Function

No `@category`, no `@since`, no `@example`. `@internal` as last tag.

---

## 3. Text Conventions

| Rule                                 | Correct                         | Incorrect                             |
| ------------------------------------ | ------------------------------- | ------------------------------------- |
| Present-tense third-person summaries | `Clamps a value between bounds` | `This function clamps a value`        |
| `@param` sentence fragments          | `@param value - Value to clamp` | `@param value - The value to clamp.`  |
| `@returns` sentence fragments        | `@returns Clamped value`        | `@returns Returns the clamped value.` |
| No trailing periods on fragments     | `Value to test`                 | `Value to test.`                      |
| Unicode permitted in prose           | θ, π, ≈, ±, ∞                   | `\theta`, `\pi`                       |
| LaTeX prohibited in TSDoc            | ASCII art in code blocks        | `\frac{}{}`, `\sqrt{}`                |

### `@see` Format

Always use: `@see {@link Target} - description`

### Section Dividers

```
/* ========================================================================== */
/* Section Name                                                               */
/* ========================================================================== */
```

---

## 4. Base `@category` Vocabulary

These categories are available to ALL packages:

| `@category`     | Purpose                               |
| --------------- | ------------------------------------- |
| `Constant`      | Static readonly frozen instances      |
| `Factory`       | Static creation methods               |
| `Arithmetic`    | Arithmetic operations                 |
| `Computed`      | Pure computations returning scalars   |
| `Transform`     | Shape-preserving operations           |
| `Interpolation` | Value blending                        |
| `Comparison`    | Equality, ordering, predicates        |
| `Mutator`       | Instance set/copy/reset               |
| `Accessor`      | Derived getters (readonly properties) |
| `Conversion`    | Serialization and type conversion     |
| `Core`          | Class-level `@category`               |
| `Types`         | Interfaces, type aliases              |
| `Helpers`       | Helper functions outside classes      |
| `Configuration` | Configuration functions               |
| `Assertion`     | Public assertion functions            |

Packages MAY define additional type-specific categories. See each package's TSDoc documentation for its extended vocabulary.

---

## 5. Prohibited Tags

| Tag           | Reason                                                     |
| ------------- | ---------------------------------------------------------- |
| `@group`      | Use visual section dividers instead                        |
| `@alpha`      | All exports are stable                                     |
| `@beta`       | All exports are stable                                     |
| `@override`   | Not in the engine's ESLint allowed tag list                |
| `@migration`  | Use CHANGELOG entries instead                              |
| `@deprecated` | Deprecated symbols are removed outright rather than marked |
| `@alias`      | Aliased symbols are removed outright                       |
