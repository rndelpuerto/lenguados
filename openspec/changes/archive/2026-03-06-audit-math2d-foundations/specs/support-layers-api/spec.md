## MODIFIED Requirements

### Requirement: Deterministic kernel exports

The `deterministic/deterministic-kernels.ts` module SHALL export:

- `DeterministicKernels` object containing all deterministic functions
- Individual named exports: `sin`, `cos`, `sinCos`, `tan`, `asin`, `asinSafe`, `acos`, `acosSafe`, `atan`, `atan2`, `sqrt`, `sqrtSafe`, `exp`, `expSafe`, `log`, `logSafe`, `pow`, `hypot`
- `config` object with `useNativeMath: boolean` toggle

**AUDIT SCOPE**: The deterministic kernel SHALL be re-evaluated:

- Are the polynomial coefficients verified against the original fdlibm C source?
- Is the Safe variant set complete? (Currently: sqrtSafe, acosSafe, asinSafe, expSafe, logSafe — is powSafe missing? tanSafe?)
- Is the `DeterministicKernels` object necessary or is it redundant with named exports?
- What is the performance overhead of fdlibm vs native Math? Should this be benchmarked and documented?
- Is `config.useNativeMath` a global mutable singleton? What are the thread-safety implications? (Not applicable in JS, but relevant for Web Workers)

#### Scenario: Kernel Safe variants completeness evaluated

- **WHEN** the audit evaluates which kernel functions have Safe variants
- **THEN** it SHALL determine whether `powSafe`, `tanSafe`, `atan2Safe`, `hypotSafe` should exist, based on the domain restrictions of each function and physics engine usage patterns

#### Scenario: DeterministicKernels object evaluated

- **WHEN** the audit evaluates the `DeterministicKernels` namespace object
- **THEN** it SHALL determine whether a namespace object adds value over named imports (tree-shaking impact, DX for passing all kernels to a subsystem), citing three.js MathUtils pattern

#### Scenario: Deterministic sin matches fdlibm reference

- **WHEN** `sin(PI / 6)` is called
- **THEN** it SHALL return a value within 1 ULP of the fdlibm reference value for sin(PI/6)

---

### Requirement: Type interfaces symmetry

The `types/index.ts` module SHALL export exactly 7 Readonly + 7 Mutable interface pairs
plus 7 type guard functions.

**AUDIT SCOPE**: The type system SHALL be re-evaluated:

- Is the Readonly/Mutable split genuinely useful in TypeScript (structural typing makes it shallow)?
- Do reference libraries use duck-typing interfaces? (three.js: no; gl-matrix: Float32Array; Eigen: templates)
- Should type guards use `is` return type for TypeScript narrowing? (e.g., `(value: unknown): value is Vector2Like`)
- Are type guards runtime checks only, or do they also refine the TypeScript type? (Both ideally)
- Is 7 pairs the right number, or should there be a generic `MathObject` base?

#### Scenario: Type guard narrowing validated

- **WHEN** `isVector2Like(value)` returns `true`
- **THEN** TypeScript SHALL narrow the type to `Vector2Like` in the truthy branch, enabling `.x` and `.y` access without casting

#### Scenario: ReadonlyVector2Like accepts plain object

- **WHEN** a function parameter is typed as `ReadonlyVector2Like`
- **THEN** it SHALL accept `{ x: 3, y: 4 }` as a valid argument

#### Scenario: Type guard handles null/undefined

- **WHEN** `isVector2Like(null)` or `isVector2Like(undefined)` is called
- **THEN** it SHALL return `false` without throwing

---

### Requirement: Validation assertions for all 7 types

The `validation/assert.ts` module SHALL export configuration, generic, scalar, component-level,
and shape assertions for all 7 core types.

**AUDIT SCOPE**: The validation layer SHALL be re-evaluated:

- Is the `setAssertionsEnabled` runtime toggle the right approach, or should it be compile-time only (via `__LENGUADOS_DEV__`)?
- Do reference libraries use runtime toggles (Box2D: compile-time; Unity: compile-time; three.js: no assertions)?
- Are the error messages actionable? (See dx-quality spec)
- Should assertions validate mathematical invariants (e.g., Rotation2 cos^2+sin^2=1) or only component finiteness?
- The `name?` parameter pattern — does it match how zod, yup, or Joi name their validation contexts?

#### Scenario: Runtime vs compile-time toggle evaluated

- **WHEN** the audit evaluates `setAssertionsEnabled(false)` vs DCE via `__LENGUADOS_DEV__`
- **THEN** it SHALL document whether both mechanisms are necessary, whether they can conflict, and what reference libraries do (compile-time is standard in C++ and Rust; runtime is unusual)

#### Scenario: Mathematical invariant assertions evaluated

- **WHEN** the audit evaluates whether `assertRotation2(cos, sin)` should check `cos^2+sin^2 ≈ 1`
- **THEN** it SHALL document: the cost of the additional check, how often non-unit rotations cause bugs, and whether Box2D/Rapier validate rotation normalization at boundaries

#### Scenario: Assertions are no-ops in production

- **WHEN** `process.env.NODE_ENV === 'production'`
- **THEN** all assertion functions SHALL return immediately without any checks

---

### Requirement: Public index.ts exports are clean and complete

The `src/index.ts` SHALL re-export types, auxiliary modules, core types, deterministic functions,
and validation functions. Utils remain on subpath imports.

**AUDIT SCOPE**: The public API surface SHALL be re-evaluated:

- Is the total number of named exports reasonable? (gl-matrix: ~200; three.js: ~500; target for this library?)
- Are all exports useful from the main entry, or should some move to subpath?
- Is the `DeterministicKernels` object export necessary on the main entry?
- Should `SinCos` interface be on the main entry or only via subpath?
- Does re-exporting validation functions pollute the main namespace?

#### Scenario: Export count evaluated

- **WHEN** the audit counts all named exports from the main entry
- **THEN** it SHALL document the count and compare against gl-matrix and three.js, determining if the main entry is appropriately lean or bloated

#### Scenario: Main import provides core API

- **WHEN** `import { Vector2, sin, EPSILON, assertFinite } from '@lenguados/math2d'`
- **THEN** all symbols SHALL resolve correctly

#### Scenario: Utils not in main export

- **WHEN** `import { parseVector2 } from '@lenguados/math2d'`
- **THEN** it SHALL NOT resolve — parse functions are only available via `@lenguados/math2d/utils/parse`
