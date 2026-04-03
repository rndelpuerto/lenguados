## ADDED Requirements

### Requirement: Tree-shaking architecture is correctly implemented

The `validation/` layer SHALL use the conditional export pattern so that in production builds all assertion calls are removed (tree-shaken). The entry point `./validation/assert` SHALL resolve to a no-op stub in production (`NODE_ENV=production`) and to the real assertions in development. The audit SHALL verify that importing `@lenguados/math2d/validation/assert` in a production build adds zero bytes to the bundle.

#### Scenario: Production build strips all assertions

- **WHEN** a production bundle is built (`NODE_ENV=production`) and the bundle is analyzed
- **THEN** no assertion function bodies SHALL appear in the output

#### Scenario: Development build includes assertion logic

- **WHEN** a development bundle is built (`NODE_ENV=development`) and assertions are triggered
- **THEN** they SHALL throw descriptive errors for invalid inputs

---

### Requirement: Assertion functions cover all core types

The validation layer SHALL provide assertion functions for: `assertFinite`, `assertNonZero`, `assertRange`, `assertPositive`, `assertNonNegative`, `assertSafeInteger`, and `assert` (generic). For each core type, there SHALL be a corresponding `assert<Type>` function: `assertVector2`, `assertMatrix2`, `assertMatrix3`, `assertRotation2`, `assertRotation2Normalized`, `assertTransform2`, `assertComplex`, `assertInterval`. The audit SHALL verify that the triality surface area is consistent — if a method has a strict variant in `core/`, the corresponding assertion SHALL exist in `validation/`.

#### Scenario: All core type assertions exist

- **WHEN** the audit enumerates all `assert*` exports from `validation/`
- **THEN** an assertion SHALL exist for each of the seven core types

#### Scenario: `assertRotation2Normalized` validates unit-length constraint

- **WHEN** `assertRotation2Normalized({cos:1, sin:0})` is called
- **THEN** it SHALL pass (valid unit rotation)
- **WHEN** `assertRotation2Normalized({cos:2, sin:0})` is called
- **THEN** it SHALL throw a descriptive error (cos²+sin² ≠ 1)

---

### Requirement: `setAssertionsEnabled` / `areAssertionsEnabled` is the runtime toggle

The validation layer SHALL export `setAssertionsEnabled(enabled: boolean): void` and `areAssertionsEnabled(): boolean`. These SHALL be the only way to programmatically disable assertions at runtime (e.g., for benchmarks that need to strip validation overhead without a full rebuild). The audit SHALL verify these are exported from the main `index.ts` and from the `./validation/assert` subpath.

#### Scenario: Runtime toggle disables all assertions

- **WHEN** `setAssertionsEnabled(false)` is called and then `assertPositive(-1)` is called
- **THEN** no error SHALL be thrown

#### Scenario: `areAssertionsEnabled` reflects toggle state

- **WHEN** `setAssertionsEnabled(true)` then `setAssertionsEnabled(false)` are called
- **THEN** `areAssertionsEnabled()` SHALL return `false` after the second call

---

### Requirement: Validation layer does not duplicate core type logic

The `assert<Type>` functions SHALL only validate the structural contract (correct fields, correct types, correct numeric ranges). They SHALL NOT re-implement mathematical operations. Any assertion that computes something complex (e.g., determinant, eigenvalue) SHALL delegate to the relevant `core/` method rather than re-implementing.

#### Scenario: `assertRotation2Normalized` delegates normalization check to arithmetic

- **WHEN** `assertRotation2Normalized` is implemented
- **THEN** it SHALL compute `Math.hypot(r.cos, r.sin)` and compare to 1 within EPSILON — it SHALL NOT implement a full rotation normalization algorithm

---

### Requirement: No assertions in production hot paths

All assertion calls in `core/` methods SHALL be gated through the conditional export mechanism. The audit SHALL verify that no core method has unconditioned assertions that remain in production builds, as this would impose a performance penalty on consumers who cannot tree-shake JavaScript.

#### Scenario: Core methods contain no direct validation logic

- **WHEN** the audit scans all `core/` source files for direct calls to assertion functions
- **THEN** all assertion calls SHALL be imported from the conditional export path, not hard-coded
