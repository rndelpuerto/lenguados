# Testing Strategy

> **Status:** MANDATORY
> **Scope:** Testing conventions for all packages in the lenguados engine.

Tests must be written under the assumption that an error in bit N of a Double (Float64) will destroy the P2P Lockstep game system in production. **Sporadic failures are not acceptable.**

---

## 1. Test Topology

Every package SHALL implement three tiers of testing:

1. **Unit Tests (Jest)** — Verify concrete results with known inputs and expected outputs.
2. **Boundary Checks (Edge Cases)** — Every input must be tested against: `NaN`, `+Infinity`, `-Infinity`, `+/-0`, and `Number.MAX_VALUE`.
3. **Property-Based Testing (`fast-check`)** — Test abstract algebraic invariants over randomized input domains.

---

## 2. Test File Conventions

- Tests live in `packages/*/test/` mirroring the source structure
- Naming: `*.node.spec.ts` (Node environment), `*.dom.spec.ts` (jsdom environment)
- Coverage thresholds: 90% lines/statements/functions, 80% branches

```bash
npm test              # All tests (includes lint)
npm run test:unit     # Tests without lint
npm run test:watch    # Watch mode

# Run a single test file
npx jest --testPathPatterns="packages/<pkg>/test/<path>" --no-coverage
```

---

## 3. Property-Based Testing with fast-check

Any new method on a core type MUST algorithmically test its mathematical invariants using `fast-check`. Examples of invariants to test:

- **Commutativity**: `op(a, b) === op(b, a)`
- **Associativity**: `op(op(a, b), c) === op(a, op(b, c))`
- **Identity**: `op(a, identity) === a`
- **Invertibility**: `op(a, inverse(a)) === identity`
- **Closure**: the result of an operation on valid inputs is itself a valid instance

Each package documents its specific algebraic invariants.

---

## 4. Dangerous Path Testing (Unchecked)

The `*Unchecked` methods are exempt from throwing errors by design. Test suites MUST NOT test for error emission on these functions. Instead, test that the mathematical fallthrough occurs predictably — degenerate inputs produce `+/-Infinity` or `NaN` as defined by IEEE 754.

---

## 5. Tolerance Handling

- Never use `.toBe()` directly for floating-point comparisons
- Use `toBeCloseTo(expected, precision)` where `precision` is the number of decimal digits
- Define tolerance constants per package (e.g., `EPSILON = 1e-10` for double precision)
- For angular comparisons, use dedicated angle-difference functions rather than scalar comparison — wrap-around at the circle boundary causes naive equality to fail

Each package documents its specific tolerance constants and comparison patterns.
