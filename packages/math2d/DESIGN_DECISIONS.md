# @lenguados/math2d Design Decisions

> **Status:** Reference
> **Last reviewed:** 2026-07

This document captures the architectural decisions behind `@lenguados/math2d`, contrasted against established conventions from 2D mathematics, physics simulation, and GPU computing domains. Each section follows an ADR (Architecture Decision Record) style where applicable: context, decision, alternatives considered, and rationale.

---

## 1. Design Conventions

The API follows established conventions from the broader 2D mathematics, physics simulation, and GPU computing domains.

| Technique / Algorithm | Decision                        | Convention Source               | Rationale                                                                                |
| :-------------------- | :------------------------------ | :------------------------------ | :--------------------------------------------------------------------------------------- |
| Smooth interpolation  | `smoothStep`                    | GLSL / HLSL spec                | Standardized Hermite pattern. (`smoothlerp` is a non-standard anti-pattern.)             |
| 2D rotations          | `Rotation2(cos, sin)` object    | Unit complex representation     | Storing only the processed scalars avoids hidden latency in body-update loops.           |
| Matrix memory layout  | Column-major (1D)               | WebGL / GPU buffer convention   | One-to-one compatibility with GPU buffer layouts (`Float32Array` ready for upload).      |
| Precision tolerance   | `EPSILON` = $1 \times 10^{-10}$ | Double-precision best practices | Conservative for double precision; float32 engines typically use $10^{-7}$ to $10^{-8}$. |

---

## 2. Deliberately Excluded Patterns

Based on theoretical failures in abstraction, the following designs have been intentionally rejected.

### ADR-001: No `Complex.min` / `Complex.max`

- **Context:** developers may expect min/max operations on complex numbers by analogy with real-number types.
- **Decision:** do not implement ordering operations on `Complex`.
- **Alternatives considered:** comparison by magnitude, comparison by real part.
- **Rationale:** complex numbers inhabit a plane ($\mathbb{C}$), not a real number line ($\mathbb{R}$). They lack a total order relation compatible with their field operations. Any ordering would be mathematically illegitimate and misleading.

### ADR-002: No `Transform2.slerp`

- **Context:** 3D engines commonly provide spherical linear interpolation (slerp) on transforms via quaternions in $\mathrm{SO}(3)$.
- **Decision:** do not provide a dedicated `slerp` method on `Transform2`.
- **Alternatives considered:** hybrid slerp combining position, rotation, and scale interpolation.
- **Rationale:** in the $\mathbb{R}^2$ domain, hybrid interpolation mixing linear position, vectorial rotation, and scaling is degenerate. The approved solution is an explicit general `lerp(a, b, t)` that internally delegates to `Vector2.lerp` (position), `Rotation2.lerp` (rotation), and `Vector2.lerp` (scale) respectively. Note: in 2D, lerp of unit complex numbers IS slerp, so a separate slerp method is unnecessary.

---

## 3. Ergonomics and Validation Tiers

### ADR-003: Object-Oriented Ergonomics over Raw Typed Arrays

- **Context:** some math libraries rely entirely on pre-allocated mutations using raw `Float32Array` values and loose global functions (for example `vec2.add(out, a, b)`).
- **Decision:** `@lenguados/math2d` retains object-oriented programming ergonomics, encapsulating state in instantiable classes (`this.x`, `this.y`). It employs pure static methods and fluent instance methods (`v.add(b)`).
- **Alternatives considered:** pure functional approach with typed arrays.
- **Rationale:** gains ergonomics without sacrificing performance, facilitating readability for simulation code rather than strict WebGL buffer-filling patterns. Static methods still accept an optional `out` parameter for allocation-free hot paths.

### ADR-004: Explicit `Rotation2` Object (Unit Complex Representation)

- **Context:** some designs store rotations as raw angles or rely on 3D quaternions even for 2D use cases.
- **Decision:** `@lenguados/math2d` explicitly introduces `Rotation2`, storing $(\cos, \sin)$ internally instead of a floating-point scalar (radian).
- **Alternatives considered:** store rotation as a single radian value (simpler API, smaller memory footprint).
- **Rationale:** eliminates costly and unnecessary kernel calls (`Math.cos`, `Math.sin`) during the 2D vertex / particle update cycle. The unit complex number representation is the standard approach for efficient 2D rotation in physics engines and robotics literature.

### ADR-005: Three-Tier Validation Pipeline (default / Safe / Unchecked)

- **Context:** statically-typed languages can leverage compile-time assertions to omit costly `NaN` / zero-division validation at runtime. JavaScript lacks these compile-time guarantees.
- **Decision:** `@lenguados/math2d` implements a three-tier validation pipeline: a default path with dev-only assertions (stripped in production via DCE), a Safe path that returns fallback values on invalid input (`divideSafe`, `normalizeSafe`), and an Unchecked path that bypasses all validation for hot paths where the caller guarantees valid input.
- **Alternatives considered:** single validation path (always validate), runtime-configurable validation toggle.
- **Rationale:** the three-tier approach lets simulation code (for example a physics solver that guarantees non-zero inputs) run the Unchecked path for linear CPU execution, while application-level code uses Safe for robustness and default for development-time error detection.

### ADR-006: Zero-Allocation Mutation

- **Context:** immutable math approaches return new instances for all operations, generating significant garbage-collection pressure.
- **Decision:** `@lenguados/math2d` maintains a strict zero-allocation paradigm. Pre-existing instances are rewritten / mutated in-place. Static functions require an optional `out` argument.
- **Alternatives considered:** immutable value objects (functional style), copy-on-write.
- **Rationale:** in a physics engine running thousands of operations per frame, allocation and GC pauses are unacceptable. Mutation-in-place with optional `out` parameters eliminates allocation overhead entirely while still allowing callers to opt into fresh instances when convenient.

---

## 4. Ratified Policies

The following policies are normative for the entire package. Each is grounded in academic sources (IEEE 754, fdlibm, numerical analysis literature) and established numerical computing practices.

### ADR-007: Constructor Purity — No Assertions in Constructors

- **Context:** a JavaScript math library cannot rely on compile-time type constraints. The temptation is to add defensive assertions to constructors so that objects are always in a valid state upon creation.
- **Decision:** all constructors in `core/` MUST be total, scalar-only functions performing pure assignment with zero validation and zero shape dispatch. `NaN` and `Infinity` are valid IEEE 754 values. Omitted parameters default to the type's neutral element (zero vector, identity matrix). Array and object construction is the exclusive domain of the `from*` factories (`fromArray` validates bounds and throws `RangeError` in every build; `fromObject` trusts the TypeScript type). The canonical comment `// Pure math: no assertions — Infinity/NaN are valid IEEE 754 values` is required in every constructor.
- **Alternatives considered:** dev-only assertions (DCE-safe), always-on validation, optional validation flag, polymorphic constructors with structural throws, polymorphic constructors with silent fallthrough to the neutral element.
- **Rationale:** constructors are called in tight allocation loops (for example `ensureOut(out)`, whose body evaluates `out ?? new Vector2()`). A DCE-stripped assertion in the constructor body still adds a branch in development builds, which hurts profiling accuracy. `NaN` / `Infinity` propagation through the math layer is a feature — it surfaces bugs (via `isNaN` detection) rather than silently masking them. The scalar-only shape follows the universal pattern of exemplary math libraries: total scalar constructors plus named factories that hard-fail on malformed runtime-shaped input in every build. Both polymorphic alternatives were rejected: structural throws put fallible dispatch on the hottest allocation path, and silent fallthrough produces the worst failure class — a structurally invalid input mapped to a valid-looking neutral element is undetectable downstream (a silently wrong result is worse than an exception).
- **Compliance:** all 7 core types comply — `Vector2`, `Rotation2`, `Complex`, `Interval`, `Matrix2`, `Matrix3`, `Transform2` (scalar-only signatures ratified 2026-07).

### ADR-008: Assertion Functions Must Reject NaN via `value !== value`

- **Context:** assertion functions like `assertPositive`, `assertNonNegative`, and `assertNonZero` guard numeric ranges. IEEE 754 comparison semantics cause all comparisons involving `NaN` to return `false` — so `NaN <= 0`, `NaN === 0`, and `NaN < 0` are all `false`. A guard written as `if (value <= 0) throw` silently passes `NaN`.
- **Decision:** every assertion function that guards a numeric range MUST include an explicit `NaN` trap: `if (value !== value || <range_check>)`.
- **Alternatives considered:** `Number.isNaN(value)`, `isNaN(value)` (coerces string to `NaN` — incorrect), `value !== value` (fastest, no call overhead, universally understood in numerical contexts).
- **Rationale:** `NaN` is not in any valid numeric range. Silently passing `NaN` into math that assumes a validated input produces incorrect results downstream without any error signal. The `value !== value` idiom is the canonical IEEE 754 NaN test, costs zero overhead, and is consistent with how deterministic math kernels handle the check.

### ADR-009: `setDirect` Pattern — Bypassing Re-Validation on Pre-Computed Results

- **Context:** core classes that store normalized state (`Rotation2` stores unit-length $(\cos, \sin)$; `Interval` stores ordered $[\min, \max]$) expose a `set` method that normalizes / validates inputs. Factory methods and static computations often pre-compute values that are already in the correct normalized form (for example $\cos(\theta)$ is always in $[-1, 1]$; $x \cdot \mathrm{inv}$ is unit-length by construction).
- **Decision:** these classes expose a private `setDirect` method for internal use. All internal code paths that can prove the invariant MUST use `setDirect` rather than `set`. User-facing code paths MUST use `set`.
- **Alternatives considered:** inlining the assignment directly, removing `set` normalization (would break user-facing safety), always using `set` (simpler but double-computes magnitude in hot paths).
- **Rationale:** the `set` method calls `Math.sqrt` / `hypot` internally to normalize. In methods like `Rotation2.fromVector2` that have already computed the unit direction, calling `set` triggers a second identical `Math.sqrt` — wasted computation in a hot-path factory. The `setDirect` pattern provides an escape hatch that is private (not part of the public API), clearly named, and limited to internal code that has explicitly proven the invariant.

### ADR-010: `sy`-Flip Convention in `Matrix3.fromTransform2`

- **Context:** composing Scale → Rotate → Translate into a `Matrix3` produces a column-major affine matrix. Two conventions exist for laying out the rotation-scale block: $[s_x \cos,\ s_x \sin;\ s_y \cdot (-\sin),\ s_y \cos]$ (Y-up, CCW positive, sign flip on the $s_y \sin$ entry) versus the alternative $[s_x \cos,\ s_x \sin;\ -s_y \sin,\ s_y \cos]$ (mathematically equivalent but reads the negation as sitting on $\sin$ rather than on $s_y$).
- **Decision:** `math2d` multiplies the negation through to $s_y$ (layout `m10 = sy · −sin = -sy · sin`) in both `Matrix3.fromTransform2` (`scale.y * -sin`) and `Matrix3.fromTransform2Like` (`-sy * sin`). The identity $s_y \cdot (-\sin) = -s_y \cdot \sin = -(s_y \cdot \sin)$ means all three forms are mathematically equivalent; the chosen form keeps $s_y$ visible as a direct multiplier adjacent to the negation, matching how readers parse the column second-column entry as "scaled rotated $y$ axis".
- **Alternatives considered:**
  - **Factor the negation onto $\sin$** — write `sy * (-sin)` uniformly. Equivalent result but obscures that $s_y$ scales the rotated Y axis.
  - **Delegate to `Matrix3.fromRotation` + `Matrix3.fromScale` composition** — correct but allocates two intermediate matrices and a third multiply; rejected on performance grounds for a hot factory.
  - **Use row-major instead** — changes the layout of the whole package; out of scope.
- **Rationale:** the current form is readable as "column 0 = $s_x$ scaling the $(\cos, \sin)$ direction; column 1 = $s_y$ scaling the $(-\sin, \cos)$ perpendicular" — a direct mental model for Y-up CCW rotation. Any future refactor MUST preserve the mathematical identity and MUST NOT require updating call sites of `fromTransform2` / `fromTransform2Like` that depend on the result being bit-identical.
- **Compliance:** both factory methods in `core/matrix3.ts` use this convention. `fromShear` and `fromReflection` encode separate entries and do not touch $s_y \sin$.

---

## 5. SVD and Derivatives

The five SVD-derivative public symbols (`Matrix2.svd`, `Matrix2.pseudoInverse`, `Matrix2.polarDecompose`, `Matrix2.conditionNumber`, `Rotation2.fromMatrix2Closest`) share a single closed-form 2×2 kernel. Their public-surface design embeds six interlocking decisions captured below as ADRs.

### ADR-011: SVD Result Type Uses `ReadonlyRotation2Like` (Not Concrete `Rotation2`)

- **Context:** the `SvdResult` interface returned by `Matrix2.svd` could declare `U` and `V` as `Rotation2` instances or as the structural `ReadonlyRotation2Like` shape ($\{ \cos, \sin \}$).
- **Decision:** `SvdResult.U` and `SvdResult.V` are typed as `ReadonlyRotation2Like`. The implementation returns plain object literals; consumers wanting `Rotation2` instances opt in via `new Rotation2(result.U.cos, result.U.sin)`.
- **Alternatives considered:** return `Rotation2` instances (more ergonomic but forces an allocation), return concrete `Vector2` for $\sigma$ (heavier than needed for a 2-tuple, requires `import { Vector2 }` in matrix2.ts).
- **Rationale:** `matrix2.ts` would gain a concrete `Rotation2` import to construct the result, creating a runtime class cycle (rotation2.ts → matrix2.ts already exists for `Rotation2.fromMatrix2`). The cross-class conversion placement rule (see the Factories and Conversions section of [ARCHITECTURE.md](ARCHITECTURE.md)) prohibits this. Using `ReadonlyRotation2Like` lets the result flow through both directions without import cycles.

### ADR-012: $\sigma$ Is `ReadonlyVector2Like` (Not 2-Tuple, Not `[number, number]`)

- **Context:** the singular values $(\sigma_x, \sigma_y)$ are returned in the same `SvdResult.sigma` slot. Candidate types: `Vector2`, `ReadonlyVector2Like`, `[number, number]`, separate `sigmaX, sigmaY` scalar fields.
- **Decision:** `SvdResult.sigma` is typed as `ReadonlyVector2Like`. Consumers access via `result.sigma.x` and `result.sigma.y`.
- **Alternatives considered:** concrete `Vector2` (forces an allocation per call, requires `import { Vector2 }` in matrix2.ts which is already permitted but ties the result lifetime to a class instance), `[number, number]` (lighter weight but breaks the structural-shape pattern used elsewhere in the package for paired numeric data), separate `sigmaX, sigmaY` fields (more keys without semantic gain).
- **Rationale:** $(\sigma_x, \sigma_y)$ is a paired numeric quantity with a natural geometric reading — the singular values are the lengths of the principal axes of the image ellipse, naturally addressed by an `{ x, y }` structural shape. `ReadonlyVector2Like` matches this reading without imposing class identity. The shape lets downstream methods (`pseudoInverse`, `polarDecompose`, `conditionNumber`) consume the result via duck-typing without rewrapping the values, and lets consumers feed it into any `Vector2`-accepting API (`Vector2.add`, `Vector2.multiplyScalar`) when treating $(\sigma_x, \sigma_y)$ as a scale-factor vector.

### ADR-013: No Triality Variants for Decompositions

- **Context:** the package convention is a triality — `op()` (strict), `opSafe()` (fallback), `opUnchecked()` (no validation). The five new methods break this pattern.
- **Decision:** `svd`, `pseudoInverse`, `polarDecompose`, `conditionNumber`, and `fromMatrix2Closest` have a single tier each. NaN propagates through every result; degenerate inputs (singular matrix, zero matrix) produce documented IEEE 754 results (`Infinity`, `NaN`, `IDENTITY`) without throwing.
- **Alternatives considered:** add `*Safe` variants returning identity-rotation fallbacks on singularity, add `*Unchecked` variants skipping the algorithmic pivoting branches inside the closed-form kernel.
- **Rationale:** matches the precedent set by `Matrix2.eigendecompose` (also single-tier). The Demmel-Kahan 1990 closed-form 2×2 SVD kernel is graceful by construction — every algorithm path handles singular and ill-conditioned input through IEEE 754 arithmetic without an explicit division-by-zero check. A `*Safe` variant would have nothing to fall back to that improves on `Infinity` / `NaN` propagation, since IEEE 754 already produces the diagnostic value. A `*Unchecked` variant would yield the same code path as the default because the decomposition contains no precondition assertion to skip.

### ADR-014: Convention A — Signed $\sigma_y$ (Reflection in Singular Value, Not Rotations)

- **Context:** the 2D SVD admits two sign conventions: (A) $\sigma_x \geq 0$ but $\sigma_y$ may be negative, with $U$ and $V$ always proper rotations; (B) $\sigma_x \geq |\sigma_y| \geq 0$ unsigned, with the reflection sign carried by the right-hand factor $V$ (or by $U$).
- **Decision:** `math2d` adopts Convention A. The reflection sign of $M$ flows into $\sigma_y$ such that $\det(M) = \sigma_x \cdot \sigma_y$ holds as an exact algebraic identity, and both $U$ and $V$ remain proper rotations.
- **Alternatives considered:** the unsigned-σ convention (Convention B). Most introductory linear-algebra textbooks use it, and most general-purpose numerical SVD drivers default to it because they support arbitrary $m \times n$ shapes where signing $\sigma_y$ is not always meaningful.
- **Rationale:** the result type carries $U$ and $V$ as `ReadonlyRotation2Like`, which is the structural shape of a proper rotation. Encoding a reflection in either factor would either require typing them as the more general `ReadonlyMatrix2Like` (heavier, breaks the existing `Rotation2` interop) or storing a `sign` field outside the shape (loses the unit-rotation invariant in the type). Convention A absorbs the reflection into a value field (`sigma.y`) where the sign carries no structural invariant, keeping the type system clean. The same convention simplifies the orthogonal Procrustes problem (Schönemann 1966, Kabsch 1976) and the polar decomposition (Higham 2002 §5.5) because the closest-rotation factor reduces to $R = U \cdot V^\top$ without a sign-correction column flip.

### ADR-015: `closestRotation` Lives on `Rotation2`, Not on `Matrix2`

- **Context:** the closest-rotation factory could live as `Matrix2.toClosestRotation()` (instance method on the input class) or as `Rotation2.fromMatrix2Closest()` (static factory on the output class).
- **Decision:** the canonical entry-point is `Rotation2.fromMatrix2Closest(matrix)`. There is no `Matrix2.toClosestRotation` or `Matrix2.closestRotation` instance method.
- **Alternatives considered:** add a reciprocal `Matrix2.toClosestRotation()` for symmetry with `Matrix2.transpose()`, `Matrix2.inverse()`, etc.
- **Rationale:** the cross-class conversion placement rule (see the Factories and Conversions section of [ARCHITECTURE.md](ARCHITECTURE.md)) — the dependent class hosts the cross-class conversion. `rotation2.ts` already imports `Matrix2` for `Rotation2.fromMatrix2`; placing the reciprocal on `Matrix2` would force a concrete `Rotation2` import in `matrix2.ts`, creating a runtime class cycle. The factory placement also aligns with the package-wide `from*` pattern (see `Rotation2.fromAngle`, `Rotation2.fromVector2`, `Rotation2.fromComplex`): cross-class construction is a property of the constructed class, not of the source class. CI rule-invariants (`.github/workflows/rule-invariants.yml`) grep-enforces that `toClosestRotation` does not appear in `matrix2.ts`.

### ADR-016: No `out?` Parameter for Composite Returns (`SvdResult`, `PolarDecomposeResult`)

- **Context:** the package convention for static methods is `static op(input, out?: T): T` to support allocation-free hot paths. The composite-return methods (`svd`, `polarDecompose`) could accept `out?: SvdResult` and `out?: PolarDecomposeResult`.
- **Decision:** `Matrix2.svd(matrix)` and `Matrix2.polarDecompose(matrix)` allocate a fresh result object on every call. No `out?` parameter.
- **Alternatives considered:** add `out?: SvdResult` accepting a mutable shape, expose pooled scratch objects.
- **Rationale:** matches `Matrix2.eigendecompose` precedent (also allocates fresh result). The composite shapes contain `ReadonlyRotation2Like` and `ReadonlyMatrix2Like` fields — by convention they are read-only structurals, not mutable concrete classes. An `out?` parameter would force consumers to pre-allocate a mutable shape, breaking the read-only contract. For hot paths where decomposition cost matters, callers should cache the result rather than the result object.

---

## 6. Library-Side DCE for Development Assertions

### ADR-017: Library-Side Build-Time DCE via `__LENGUADOS_DEV__` (Model B)

- **Context:** the package implements two-layer validation (Layer 1 dev-only assertions in `validation/assert.ts` and `auxiliary/numeric/safety.ts`; Layer 2 always-active Safe functions). Layer 1 must be eliminated in production builds for zero overhead. Two models exist: (A) the library defers DCE to the consumer's bundler by leaving `process.env.NODE_ENV` runtime checks intact in its production bundle, or (B) the library performs DCE at its own build step using a dedicated build-time constant. Model A was the historical implementation; the production library bundle retained `assertX(value, "<Type>.<method>:<param>")` call sites and assertion-failure label strings, relying on the consumer bundler to replace `process.env.NODE_ENV` with `"production"` and run dead-code elimination as part of the consumer's final build. Model A failed for direct Node.js consumers without a bundler — the smoke test, CI scripts, and direct-import users paid full assertion call overhead.
- **Decision:** the library adopts **Model B**. The build-time constant substitution configured in `rollup.config.mjs` replaces every literal occurrence of `__LENGUADOS_DEV__` with `false` in production library builds and `true` in development library builds. Source code uses `if (__LENGUADOS_DEV__) { assertX(value, '...'); }` at every call site. The build pipeline substitution and minifier eliminate the resulting `if (false) { ... }` blocks at the library build step, removing call sites, assertion bodies, label strings, and any unreachable branches before the bundle is published.
- **Alternatives considered:** Model A (consumer-side DCE — preserved as the previous default; rejected because the library bundle is not self-contained), a literal-replacement plugin substituting `process.env.NODE_ENV` at library build time (rejected because the build-time constant substitution is already configured and adding a parallel replacement plugin duplicates responsibility; the `__LENGUADOS_DEV__` token also avoids accidental replacement of consumer code that genuinely reads `process.env.NODE_ENV` at runtime), inline `if (false)` constants directly into source (rejected because source is shared between dev and prod bundles and cannot be branched at write time).
- **Trade-offs:**
  - Direct Node.js consumers loading `lib/cjs/index.production.js` now get zero-overhead production behavior (assertion logic + label strings completely removed).
  - The development bundle preserves all assertion call sites and label strings (`__LENGUADOS_DEV__` resolved to `true`) so debugging behaviour is unchanged.
  - Runtime `setAssertionsEnabled(false)` continues to work in development; in production it is a literal no-op because the entire `if (__LENGUADOS_DEV__) { ... }` block at every call site is build-time eliminated.
  - The `__LENGUADOS_DEV__` token is project-specific — deliberately longer than the widely-used generic `__DEV__` token — to avoid collision when the library is bundled alongside other libraries in a single consumer scope.
- **Compliance:** the smoke test grep gate (`tools/benchmark/scripts/smoke.ts` step 3b) verifies that production bundles contain zero assertion-failure label strings of the form `"<Type>.<method>:<param>"`. The `tools/benchmark/src/dx/assertion-elimination.ts` helper exposes the same check programmatically. The `@types/generic.d.ts` global declaration ensures TypeScript and ESLint recognize `__LENGUADOS_DEV__` across the entire monorepo. Tests run with `__LENGUADOS_DEV__ = true` (configured via `jest.config.ts` `transform.optimizer.globals.vars`), so all assertion paths remain testable.

---

## 7. Determinism Verification Infrastructure

### ADR-018: Cross-Environment Golden File — Storage and Regeneration Model

- **Context:** the library promises bit-exact deterministic kernel output across JavaScript engines, operating systems, and CPU architectures (see `ARCHITECTURE.md` §Deterministic Toggle and §L0 — Deterministic Kernels). The bench laboratory at `tools/benchmark/` implements both halves of the verification loop — `tools/benchmark/scripts/cross-env.ts --generate-golden` produces a JSON file with ~13,000 hex-encoded Float64 reference values across the thirteen scalar kernel functions with shipped implementations (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot`, `sinh`, `cosh`), and `verifyAgainstGoldenFile()` compares any current runtime against these reference values bit-by-bit. The generated file was written to `tools/benchmark/results/golden.json`, a path inside the gitignored `tools/benchmark/results/` directory; the file was therefore never committed, never present on fresh clones, and never available as a stable reference. The smoke test treated its absence as a non-blocking warning, and neither `.github/workflows/bench.yml` nor `.github/workflows/pr-validation.yml` invoked any determinism verification step. At decision time the repository contained a parallel precedent of committed reference fixtures at `packages/math2d/test/deterministic/{sin,cos,sin-cos}-golden.json` (~1.75 MB total) that established the storage convention for bit-exact reference data (those fixtures were later removed as unconsumed; this golden file superseded them as the sole committed reference).
- **Decision:** the cross-environment golden file is committed to the repository at `tools/benchmark/baselines/golden.json` (alongside the existing `reduce-angle-baseline.json`). Regeneration is a deliberate, reviewed developer action — `npm run tools:bench:cross-env -- --generate-golden` writes the file, the developer reviews the printed state hash, and the commit lands via a standard pull request. CI workflows verify the committed file via `npm run tools:bench:smoke` (Node-only, ~2 s) at two checkpoints — `pr-validation.yml` (pre-merge) and `bench.yml` (post-merge, before the benchmark suite). The smoke test fails hard when the file is missing. Cross-browser verification via Playwright was originally a local-only developer command (`npm run tools:bench:cross-env -- --verify=baselines/golden.json`; the path is resolved from `tools/benchmark/`, the working directory `npm --prefix` assigns) and not part of any CI workflow — superseded by the amendment below.
- **Alternatives considered:**
  - **Gitignored `tools/benchmark/results/golden.json` (status quo)**. Rejected: generate-on-demand cannot detect drift because each run compares a freshly-generated file against itself, which is tautological. Drift detection requires a stored reference.
  - **`packages/math2d/test/deterministic/golden.json`**. Rejected: the `packages/math2d/test/` subtree is reserved for package-internal test fixtures (precedent at decision time: the sin/cos/sin-cos goldens then committed in `packages/math2d/test/deterministic/`, since removed as unconsumed). The cross-environment golden is monorepo-wide and will be reused or peered when the planned `lenguadoz` package joins the family. Per-package storage miscategorises the artefact.
  - **Git-LFS**. Rejected: the repository has no `.gitattributes` and no LFS configuration; adding LFS introduces contributor friction (`git lfs install`). The repository state at decision time included ~1.75 MB of similar reference fixtures committed without LFS in `packages/math2d/test/deterministic/`, proving the cost acceptable.
  - **Gzipped JSON**. Rejected: opaque to `git diff` and to manual inspection; requires a gunzip step inside `cross-env.ts` and `smoke.ts`. The `.gitattributes diff=binary -text` rule achieves the same review-noise reduction at zero tooling cost.
  - **Reduced sample count (~200 per function)**. Rejected: the current 1,000-sample-per-function design covers boundary values, π multiples, Cody-Waite boundary, and subnormals. Halving the count risks missing rare divergences that are the precise reason a golden file exists.
  - **CI auto-commit of regenerated goldens**. Rejected: auto-commit obscures intent (the diff lands without a human "why"). Updates are rare (Node major releases, deliberate kernel optimisation, accepted drift); the PR description is the natural place to capture intent and the state-hash delta.
  - **Cross-browser verification (Playwright) in CI**. Rejected for now: `cross-env --verify` always runs Playwright (no flag to skip browsers), adding 5–10 min per CI run plus a `npx playwright install --with-deps` step. Node-only smoke captures the dominant drift case (engine-level fdlibm-port regressions). A future change can promote cross-browser verification to a dedicated workflow if cross-engine drift becomes a measured concern. _Superseded — see the amendment below: promotion is justified by an explicit drift model rather than by observed drift._
- **Trade-offs:**
  - Repository grows by approximately 2.5–3 MB (single committed JSON). Precedent at decision time: ~1.75 MB of similar reference fixtures were committed in `packages/math2d/test/deterministic/` without issue (since removed). The `.git/` directory weighs ~48 MB pre-change; the addition is ~5–6 % growth.
  - Pull-request diffs of regenerated goldens are opaque. Mitigated by the top-level `.gitattributes` rule `tools/benchmark/baselines/golden.json diff=binary -text` and by requiring the PR description to include the regeneration trigger and the new state hash.
  - Cross-engine drift (across JavaScript engines) is not auto-detected in CI under the current design. Documented as a known limitation in `tools/benchmark/README.md`; mitigated by local developer command and by the option to add a dedicated workflow if observed drift justifies the cost. _Closed by the amendment below._
- **Compliance:** the storage location, the fail-on-missing smoke behaviour, the two CI checkpoints, and the manual-regeneration model are documented in `tools/benchmark/README.md` (§Cross-environment determinism verification, §CI integration, and §Troubleshooting) — the developer-facing reference for regeneration triggers, local cross-browser verification, and troubleshooting. The repository quality gates treat the committed golden file as mandatory: the smoke test fails hard when it is missing.
- **Amendment — event-triggered cross-browser CI verification.** The original rejection of Playwright-in-CI rested on two premises that no longer hold: verification could not skip browsers (a `--browsers` flag now selects engines) and every run cost 5–10 minutes plus a browser download (Playwright browsers are now cached in CI keyed on `tools/benchmark/package-lock.json`, the single source of the pinned browser-build versions, making warm runs materially cheaper). The promotion path the ADR reserved is exercised on a sharper basis than "observed drift": a drift **model**. Browser engines in this repository change binaries only when Playwright is bumped in the benchmark lockfile — an enumerable, path-filterable event — and kernel-numerics changes are already caught per-PR by the Node golden gate, so a per-PR browser matrix would add cost without signal while a bare calendar cadence would mostly re-verify byte-identical binaries. The dedicated `determinism-browsers.yml` workflow therefore triggers on the enumerated drift-capable paths (deterministic kernel sources, the committed golden, the cross-env harness, the benchmark lockfile, `.nvmrc`), on manual dispatch, and on a monthly cron backstop for runner-image drift no path filter can see. Two verify-tool semantics were fixed as prerequisites, since a silently green browser leg would invert the workflow's purpose: `cross-env --verify` now exits non-zero on any divergence in any environment, and a requested browser that cannot launch fails the run unless the local-only `--allow-missing-browsers` opt-out is passed (CI never passes it).

---

## 8. Interpolation Endpoint Contract

### ADR-019: Uniform Endpoint Contract for the Interpolation Family

- **Context:** the scalar `lerp` already guards both endpoints, so `Vector2.lerp`, `Complex.lerp`, `Matrix2`/`Matrix3`/`Interval.lerp`, and the position/scale slots of `Transform2.lerp` — all of which lift the scalar `lerp` per component — reproduce their endpoints bit-for-bit. Three families did not: `lerpAngle` had no endpoint guard, so `lerpAngle(finite, ±∞, 0)` returned `NaN` ($\infty \cdot 0$, IEEE 754-2019 §6.2); and `Vector2.slerp`, `Complex.slerp`, and `Rotation2.lerp` route through a magnitude/angle round-trip (normalisation, `acos`/`atan2` → `sinCos`) that drifts by up to ~1–2 ULP at the endpoints. The result was an inconsistent surface — identical-looking interpolation calls were bit-exact for some types and only near-exact for others.
- **Decision:** every interpolation method satisfies one uniform endpoint contract — at `t === 0` the result is the IEEE 754 bit-identical `a`, at `t === 1` the bit-identical `b`; NaN propagates per IEEE 754-2019 §6.2. The non-delegating kernels gain explicit endpoint short-circuits, and `Rotation2.lerp` copies `cos`/`sin` by **direct property assignment** into the output.
- **Alternatives considered:**
  - **Document the drift as a tier table (bit-exact vs near-exact).** Rejected: it codifies an implementation artefact as a contract and forces callers to memorise which methods are exact. A single invariant is more usable and more coherent.
  - **`Rotation2.lerp` endpoint via `setDirect(cos, sin)`.** Rejected: `setDirect` carries a dev-only `assertRotation2Normalized`, so a non-unit `ReadonlyRotation2Like` endpoint would throw in development — a regression versus the prior silent re-normalisation.
  - **`Rotation2.lerp` endpoint via a re-normalising assignment (`fromCS` / `set`).** Rejected: empirically only ~⅔ of stored unit rotations have $\mathrm{hypot}(\cos, \sin) = 1.0$, so dividing by the norm perturbs the bits of the rest. Direct copy is the only assignment that reproduces the endpoint exactly.
  - **Add triality (`slerpSafe` / `lerpUnchecked`).** Rejected: per the Safe-existence criteria, a `*Safe` variant exists only for a restricted domain or non-finite-from-finite output. Interpolation has neither; the endpoint guards are deterministic short-circuits, not validation. The family stays single-tier.
- **Trade-offs:**
  - **`Rotation2.lerp` non-unit precondition.** Bit-exact endpoints and incidental re-normalisation of malformed non-unit inputs are mutually exclusive. The contract prioritises bit-exactness for valid (unit) input; a non-unit `*Like` endpoint is out of contract (garbage-in/garbage-out) and is reproduced verbatim. Documented in `EDGE_CASES.md §11`.
  - **Two endpoint branches per non-delegating method.** Negligible: the comparisons against the literal endpoints are statically predicted and inline; interior values ($0 < t < 1$) are unchanged.
- **Compliance:** `EDGE_CASES.md §11` codifies the contract and its edge cases and is the public reference for the interpolation family's endpoint behaviour. The standalone `lerpAngle` carries a TSDoc `@remarks` cross-link to that section (it is the method whose endpoint behavior changed most visibly — the non-finite NaN fix).

---

## 9. Distribution Format

### ADR-020: Preserved-Module Distribution

- **Context:** the published distribution format determines how much of the library a consumer bundler can eliminate, independently of how tree-shakeable the source code is. A pre-bundled single-file output confines the consumer bundler to statement-level dead-code elimination inside one large module; whole-module elimination — dropping every module the application never imports — requires the published output to preserve module boundaries. The package also carries shared mutable state (`config.useNativeMath`, the default random source) that every entry point must observe through a single module instance.
- **Decision:** the build emits multi-module ESM and CJS trees with preserved module boundaries — one output file per source module, mirroring the source layout under `lib/esm/` and `lib/cjs/`. `module.js` is a thin facade entry that re-exports the public surface, and every subpath entry remains at its existing path as an equally thin facade. `lib/esm/` ships its own `package.json` declaring `"type": "module"` and `"sideEffects": false`, so the consumer bundler may drop any unreferenced module wholesale. Frozen-constant initializers carry pure-call annotations that are preserved through minification, keeping static-field construction eligible for elimination. The `exports` map includes denial guards for the internal layers, so deep imports into non-public module paths fail at resolution time instead of silently coupling consumers to internal structure.
- **Alternatives considered:**
  - **Per-entry self-contained bundles** — each subpath entry bundled with its own private copy of every shared module. Rejected: shared mutable state splits into one copy per entry (split-brain) — a consumer importing two entries receives two independent module states, and a toggle applied through one entry leaves the other stale. Measured consequence: `config.useNativeMath` and `setDefaultRandomSource` were broken across entries under this layout.
  - **Single flat bundle** — the entire library in one file per format. Rejected: it defeats consumer whole-module elimination, because the consumer bundler can only prune statements inside the single module. Measured consequence: a single-type import achieved only a 6.2 % size reduction relative to the full bundle.
- **Trade-offs:**
  - A single-type import costs approximately 6.6 KB gzip (measured), a −76 % reduction versus the previous distribution.
  - Shared mutable state exists exactly once — every entry and subpath resolves to the same module instances, so `config.useNativeMath` and the default random source behave consistently across the whole surface.
  - The build target is raised to ES2022 (native class static fields), which the preserved-module output relies on for eliminable static initialization.
