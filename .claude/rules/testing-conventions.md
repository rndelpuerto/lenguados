---
paths:
 - 'packages/*/test/**'
---

# Testing Conventions

- Test files use `.node.spec.ts` for Node environment, `.dom.spec.ts` for jsdom
- Mirror source structure: `src/core/vector2.ts` → `test/core/vector2.node.spec.ts`
- Property-based tests with `fast-check` go in `test/properties/`
- Run single test: `npx jest --testPathPattern="path/to/test" --no-coverage`
- Run by name: `npx jest -t "Vector2.add" --no-coverage`
- Coverage thresholds: 90% lines/statements/functions, 50% branches
- Test edge cases: NaN, Infinity, zero-length vectors, near-zero values
