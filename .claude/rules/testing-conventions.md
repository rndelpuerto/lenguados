---
paths:
 - 'packages/*/test/**'
---

# Testing Conventions

## File Types

- `*.node.spec.ts` — Node environment tests (standard math/logic)
- `*.dom.spec.ts` — jsdom environment tests (canvas/DOM-dependent)
- `*.property.node.spec.ts` — Property-based tests with fast-check
- `*.boundary.node.spec.ts` — Boundary value analysis (±π, overflow, underflow)

## Structure

- Mirror source structure: `src/core/vector2.ts` → `test/core/vector2.node.spec.ts`
- Property-based tests go in `test/properties/`
- Boundary tests go in `test/boundaries/`
- Custom arbitraries shared in `test/arbitraries.ts`

## Import Convention

- Import test globals from `@jest/globals` (not ambient): `import { describe, expect, it } from '@jest/globals'`
- Import source via relative paths: `import { Vector2 } from '../../src/core/vector2'`

## Running Tests

- Run single test: `npx jest --testPathPattern="path/to/test" --no-coverage`
- Run by name: `npx jest -t "Vector2.add" --no-coverage`
- Coverage thresholds: 90% lines/statements/functions, 50% branches
- Test edge cases: NaN, Infinity, zero-length vectors, near-zero values

## Math-Specific Patterns

For math2d-specific testing patterns (tolerance constants, property-based testing requirements, angular equality, dangerous-path testing), see `testing-deep-patterns.md`.
