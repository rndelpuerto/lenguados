---
name: implement-math-type
description: Guide for implementing a new math type or operation in @lenguados/math2d following all conventions. Use when adding Vector3, AABB, Circle, or any new mathematical primitive.
---

# Implement a New Math Type in @lenguados/math2d

Follow this checklist when creating a new mathematical type (e.g., AABB, Circle, Ray2).

## 1. Define the \*Like Interface (`src/types/`)

```typescript
export interface NewTypeLike {
 field1: number;
 field2: number;
}

export interface ReadonlyNewTypeLike {
 readonly field1: number;
 readonly field2: number;
}

export function isNewTypeLike(value: unknown): value is ReadonlyNewTypeLike {
 // duck-type check
}
```

Export from `src/types/index.ts`.

## 2. Create the Core Class (`src/core/newtype.ts`)

- Extend no base class
- Implement `NewTypeLike`
- Export `ReadonlyNewType = Readonly<NewType>`
- Export `freezeNewType(instance): ReadonlyNewType`

### Static Methods Pattern

```typescript
static operation(a: ReadonlyNewTypeLike, b: ReadonlyNewTypeLike, out?: NewType): NewType {
  const result = out ?? new NewType();
  // compute
  return result;
}
```

### Instance Methods Pattern

```typescript
operation(other: ReadonlyNewTypeLike): this {
  // mutate this
  return this;
}
```

### Error Handling Triality

For every fallible operation, provide all three:

- `op()` — throws on error
- `opSafe()` — returns fallback
- `opUnchecked()` — no validation

## 3. Use Deterministic Math

Import `sin`, `cos`, `sqrt`, `atan2` from `../deterministic/deterministic-kernels`, never `Math.*`.

`Math.floor`, `Math.ceil`, `Math.abs`, `Math.min`, `Math.max` are safe (IEEE 754 deterministic).

## 4. Add Validation (`src/validation/assert.ts`)

```typescript
export function assertNewType(value: NewType, label = 'NewType'): void {
 // validate invariants
}
```

## 5. Export from `src/index.ts`

Add re-exports for the new type and its helpers.

## 6. Write Tests (`test/core/newtype.node.spec.ts`)

- Mirror source structure
- Test all static and instance methods
- Test edge cases: NaN, Infinity, zero values, near-epsilon
- Add property-based tests in `test/properties/newtype.property.node.spec.ts`
- Add custom arbitraries to `test/arbitraries.ts` (see `testing-deep-patterns.md`)
- Test algebraic invariants: commutativity, identity, inverse, round-trip (see `testing-deep-patterns.md`)
- Test `*Unchecked` variants produce NaN/Infinity, not throws
- Use `toBeCloseTo(expected, 10)` for EPSILON-level tolerance

## 7. Document with TSDoc (see `tsdoc-conventions.md`)

- Follow canonical tag order and controlled `@category` vocabulary
- Cross-link triality variants with `@see`
- Use imperative voice for summaries
- Place methods in the correct class member section

## 8. Update Formatting/Parsing (`src/utils/`)

Add `formatNewType()` and `parseNewType()` if the type supports string representation.

## Reference Rules

- **API patterns**: `.claude/rules/math2d-patterns.md`
- **TSDoc**: `.claude/rules/tsdoc-conventions.md`
- **Architecture**: `.claude/rules/architecture-and-layers.md`
- **Testing**: `.claude/rules/testing-deep-patterns.md`
