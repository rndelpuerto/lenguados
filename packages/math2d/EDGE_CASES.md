# @lenguados/math2d Edge Cases

> **Status:** NORMATIVE
> **Scope:** documenting exact failure modes, IEEE 754 precision limits, set theory anomalies, and architectural safety-valves across `@lenguados/math2d`.

This document catalogues scenarios where the `math2d` API's behavior diverges from naive expectations, detailing exactly why it happens and how the package handles it.

---

## 1. IEEE 754 Floating-Point Precision Constraints

### 1.1 The Near-Zero Denominator — `Complex` Division

- **The engine reality:** `Complex.divide` guards the denominator with a squared-magnitude test against $\mathrm{EPSILON}^2$, which rejects any denominator whose magnitude is below `EPSILON` ($10^{-10}$). The division itself runs Smith's algorithm with pre-scaling, so intermediate overflow and underflow are handled robustly.
- **The edge case:** a denominator such as $10^{-160}$ is a valid nonzero IEEE 754 double (its square, $10^{-320}$, is a subnormal — tiny, but not `0.0`). It is rejected anyway: the near-zero threshold fires long before actual underflow, because magnitudes below `EPSILON` are treated as geometric zero by contract. The result is `RangeError("Complex.divide: cannot divide by zero-magnitude complex number")`.
- **The fix:** when sub-`EPSILON` magnitudes are meaningful in your domain, re-scale the operands before dividing; otherwise use `divideSafe`, which returns `Complex.ZERO` instead of throwing when the threshold fires.

### 1.2 The Normalization Threshold — `Vector2.normalize`

- **The engine reality:** normalizing a vector of microscopic scale.
- **The edge case:** the default and Safe tiers compute the magnitude with the overflow- and underflow-robust `hypot(x, y)` kernel — there is no squared intermediate to underflow. The rejection comes from the zero-detection contract: when the magnitude is below `EPSILON` ($10^{-10}$), `isNearZero` classifies the vector as zero-length, so `normalize` throws `RangeError("Vector2.normalize: cannot normalize zero-length vector")` and `normalizeSafe` returns `(0, 0)`.
- **Where squared underflow does apply:** only `normalizeUnchecked` uses the naive `Math.sqrt(x * x + y * y)`, whose squared intermediates can underflow (or overflow — see §7). If magnitudes below `EPSILON` are meaningful in your domain, re-scale first; the default tier's threshold is a deliberate geometric-zero contract, not a precision limitation.

---

## 2. Set Theory and Component Operations

### 2.1 The `undefined` Intersection — `Interval`

- **The expectation:** chaining fluid methods, for example `interval.union(b).intersect(c).multiplyScalar(5)`.
- **The edge case:** the intersection of two non-overlapping intervals mathematically results in the Empty Set ($\emptyset$).
- **The architecture:** in JavaScript, representing $\emptyset$ with a degenerate interval like $[0, 0]$ or $[\mathrm{NaN}, \mathrm{NaN}]$ would silently corrupt downstream arithmetic. Therefore, `Interval.intersect` explicitly returns `undefined` when sets are disjoint.
- **The rule:** you cannot safely chain `.intersect`. Callers MUST explicitly check for `undefined` to prevent `TypeError: cannot read properties of undefined (reading 'multiplyScalar')`.

### 2.2 Reversal via Negative Radius — `randomOnCircle`

- **The reality:** circular random-generation functions accept a `radius` parameter.
- **The edge case:** passing a negative radius (for example `-5`) does not throw an error in JavaScript math. However, it geometrically inverts the resultant coordinates across the origin.
- **The architecture:** `assertNonNegative` guards these functions at every call site behind the build-time constant `__LENGUADOS_DEV__` (library-side dead-code elimination — see §6.1.1 and [Design Decisions](DESIGN_DECISIONS.md) ADR-017). In production library builds the constant is substituted with `false` and the whole guard block is eliminated, making a negative radius silently degenerative.

---

## 3. The Branchless Mathematical Contract (The `*Unchecked` Path)

The ultimate architectural concession for extreme performance is the `Unchecked` variant of arithmetic methods — a deliberate decision made under engine-level optimization criteria (JavaScript engine / CPU pipeline) that mirrors the fast-paths of low-level physics kernels.

### 3.1 Branchless Normalization and Inversion

- **The context:** traditional graphics code often includes defensive checks in core functions (for example `if (len > 0)` or `length || 1`).
- **The hidden cost:** in a collision-resolution loop executed 100 000 times per frame, that `if` statement forces the CPU's branch predictor to guess. A misprediction flushes the pipeline, destroying performance.
- **The math2d architecture:** the `*Unchecked` methods (such as `Vector2.normalizeUnchecked` or `Matrix2.inverseUnchecked`) deliberately eliminate the `if`. They guarantee linear (branchless) code.
- **The edge case (the IEEE 754 contract):** if you break the contract and pass the Zero Vector to `normalizeUnchecked`, the system will execute $1 / 0$, yielding `Infinity`. Multiplying $0 \cdot \mathrm{Infinity}$ produces a result vector of `(NaN, NaN)`. Matrices with a zero determinant will fill with `Infinity`.
- **The rule:** this behavior is **NOT a bug** — it is the IEEE 754 "Garbage In, Garbage Out" contract. A `NaN` result will recursively propagate through subsequent transformations. The `*Unchecked` methods have caller-guaranteed inputs; undefined behaviour on violation. Use them only when upstream code has already verified that the length or determinant is non-zero. Otherwise use the `*Safe` variants, which substitute a neutral fallback on domain violation.

---

## 4. Angle Wrap-Around and Equality

### 4.1 The $2\pi$ Leap — `nearEquals` vs. `angleDifference`

- **The engine reality:** comparing two angles to check whether they represent the same rotational heading.
- **The edge case:** floating-point values `-3.14159` ($-\pi$) and `3.14159` ($\pi$) represent the exact same rotation, yet `nearEquals(Math.PI, -Math.PI)` returns `false`.
- **The architecture:** `Rotation2.nearEquals` first attempts a fast component comparison via relative tolerance (`relativeEquals` on `cos` and `sin`); on the slow path near the $\pm\pi$ boundary it computes the angle difference inline as $\operatorname{atan2}(\text{cross}, \text{dot})$ over the cross/dot products ($\text{cross} = a.\cos \cdot b.\sin - a.\sin \cdot b.\cos$, $\text{dot} = a.\cos \cdot b.\cos + a.\sin \cdot b.\sin$), avoiding two `atan2` calls, then tests it with `isNearZero`.
- **The rule:** developers MUST never compare rotational headings directly using the raw `angle` getter — `relativeEquals` is a scalar relative-tolerance compare that does NOT wrap angles. Use the angle-aware helpers `Rotation2.nearEquals`, `anglesNearEqual`, or `angleDifference` to handle the boundary crossing.

---

## 5. Topological Resolutions in Continuous Spaces (Interval)

Unlike `intersect`, which can result in an "Empty Set" (`undefined`) if the intervals do not overlap, the `Interval.union(a, b)` operation obeys the principles of convex geometry and continuous topological spaces, not discrete finite set theory.

> **Warning:** when `union` is applied to disjoint intervals (for example $[0, 1] \cup [5, 6]$), the system does **not** return an array or fragmented collection of discontinuous dimensions. Instead, the math package returns the convex hull of the union — the smallest single interval containing both operands: $[0, 6]$.

**Agnostic mathematical criterion:** when dealing with geometric spaces (1D, 2D), the fundamental unit of `Interval` is a continuous uninterrupted line segment. Any combinatorial operation that MUST return a single resulting `Interval` is mathematically obligated to span the complete range between the global minimum and the global maximum, inevitably absorbing the empty space $(1, 5)$. This is not an anomaly but the standard behavior defined by the topology of convex sets in $\mathbb{R}$.

---

## 6. NaN and the Assertion Boundary

### 6.1 The Assertion Boundary — Where NaN Validation Lives

The `math2d` package follows a strict layered validation model:

| Layer                                                             | NaN Handling                                                                                              |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `auxiliary/` functions (lerp, clamp, reduceAngle)                 | **No NaN validation** — pure math, propagate NaN                                                          |
| `core/` constructor                                               | **No NaN validation** — pure IEEE 754 assignment                                                          |
| `core/` `set` / `fromValues` (Vector2, Complex, Matrix2, Matrix3) | **No NaN validation** — pure IEEE 754 assignment, propagate NaN                                           |
| `Rotation2.set`                                                   | **No NaN rejection** — re-normalizes the `(cos, sin)` invariant; NaN propagates via `hypot`               |
| `Interval` factories / `set`                                      | **Dev-only validation** — `Number.isNaN` reject + `min ≤ max` assert, build-time eliminated in production |
| `validation/assert*` dev-only                                     | **Validates NaN** — range assertions include `value !== value` check                                      |
| `*Safe` variants                                                  | **Propagates NaN** from primary operands (documented contract)                                            |
| `*Unchecked` variants                                             | **GIGO** — NaN in → NaN out, never throws                                                                 |

**The key insight:** auxiliary functions (`lerp`, `clamp`, `sinCos`, etc.) and the general `core/` `set` / `fromValues` mutators do NOT validate `NaN` by documented design — they are pure composable primitives that propagate `NaN` per the NaN Propagation Policy and the Constructor Purity rule. `NaN` rejection lives only in the `validation/assert*` functions and the dev-only `Interval` factories (build-time eliminated in production) — not in every intermediate computation.

### 6.1.1 Library-Side DCE for the Assertion Layer

The `validation/assert*` row in the table above is **build-time eliminated** in production library bundles. Source code wraps every assertion call site in `if (__LENGUADOS_DEV__) { assertX(...) }`. The build-time constant substitution (configured in `rollup.config.mjs`) replaces `__LENGUADOS_DEV__` with the literal `false` in production library builds; the minifier then removes the entire `if (false) { ... }` block — including call sites, label strings, and the assertion bodies. As a result, `lib/cjs/index.production.js` and `lib/esm/module.js` contain zero assertion logic and zero assertion-failure label strings, regardless of the consumer's bundler configuration.

In the development library bundle (resolved via the `development` conditional export), `__LENGUADOS_DEV__` is the literal `true`, so all assertion paths remain reachable and exercise normally during application development. Tests run in development mode (`__LENGUADOS_DEV__ = true`) and exercise the full assertion behaviour. See `DESIGN_DECISIONS.md` ADR-017 for the model rationale.

### 6.2 NaN in `*Safe` Variants

`*Safe` methods return a fallback for operational failures (division by zero, normalize-zero-length) but they do **not** sanitize `NaN` from the inputs. If you pass `NaN` as a primary operand, the result will propagate `NaN`:

```typescript
Vector2.normalizeSafe({ x: NaN, y: 0 });
// → Vector2(NaN, NaN)  — not the fallback identity.
```

This is intentional. A `*Safe` method protects against a specific mathematical edge case (zero division, degenerate magnitude). It is not a general `NaN` shield. Passing `NaN` is a programming error that should surface via `NaN` propagation (detectable via `isNaN(result.x)`), not be silently masked by returning a fallback.

### 6.3 The Double-Normalization Anti-Pattern

Factory methods and static computations that pre-compute normalized values (for example unit direction vectors, rotation components) MUST route them through `setDirect`, not `set`.

`set` normalizes internally — so if you pass already-normalized values:

```typescript
const inv = 1 / magnitude;
rotation.set(x * inv, y * inv); // BAD: magnitude computed TWICE
```

The second `Math.sqrt` (inside `set`) is a pure waste. The correct pattern:

```typescript
const inv = 1 / magnitude;
rotation.setDirect(x * inv, y * inv); // CORRECT: invariant already proven
```

`setDirect` is private to each class. It bypasses normalization because the calling code has already proven the invariant. This is the `setDirect` pattern — see ADR-009 in [Design Decisions](DESIGN_DECISIONS.md).

`Transform2.fromComponents` is a concrete example of a related case: when a `ReadonlyRotation2Like` is passed, `cos` and `sin` are copied directly to the internal `Rotation2` without going through `set`. This avoids both the redundant `Math.sqrt` and a lossy `atan2 → sinCos` round-trip. The trade-off is that the caller is responsible for providing a unit-length object ($\cos^2 + \sin^2 = 1$). Passing a non-unit-length object stores invalid state silently — this is the implicit caller contract made explicit in the TSDoc `@remarks`.

---

## 7. Magnitude Overflow Threshold

Default-tier and Safe-tier methods that compute vector magnitude use `hypot(x, y)` from the deterministic kernels, which stays finite for any representable magnitude — up to `Number.MAX_VALUE` $\approx 1.80 \times 10^{308}$. Unchecked methods use `Math.sqrt(x * x + y * y)`, whose squared intermediate $x^2 + y^2$ overflows to `Infinity` once a single component exceeds $\sqrt{\mathtt{Number.MAX\_VALUE}} \approx 1.34 \times 10^{154}$ (or $\sqrt{\mathtt{Number.MAX\_VALUE} / 2} \approx 9.5 \times 10^{153}$ when both components are comparable).

This is a deliberate performance vs. safety trade-off documented in the [Architecture](ARCHITECTURE.md) document. If you use `normalizeUnchecked` or other Unchecked methods with components near or above $10^{154}$, you will get `NaN` or `Infinity` results silently. Use the default or Safe variants for inputs of unknown magnitude.

---

## 8. Deterministic `pow` — IEEE 754 / C99 / ECMAScript Unified Contract

The deterministic `pow(base, exponent)` kernel propagates `NaN` correctly: `pow(x, NaN) = NaN` for every $x$ (including $x = 1$ — the ECMAScript divergence from C99), and `pow(NaN, y) = NaN` for every $y$ except `pow(NaN, 0) = 1`, because any base raised to the zero exponent yields `1` (ECMAScript / C99 convention). `pow(1, ±Infinity) = NaN`.

Signed-zero handling follows the unified ECMAScript 262 §21.3.2.26, C99 Annex F §F.9.4.4, and fdlibm `e_pow.c` contract: all three authorities specify `pow(−0, y) = −0` for positive odd-integer exponents and `pow(−0, y) = −Infinity` for negative odd-integer exponents. For example, `pow(−0, 3) = −0` and `pow(−0, −3) = −Infinity`. There is no semantic divergence between the three authorities for this case. For fractional exponents, results may differ from `Math.pow` by up to 1 ULP.

---

## 9. `Interval.mod` — Removed

`Interval.mod` was removed because component-wise modulo on interval bounds (`mod(a.min, b.min)`, `mod(a.max, b.max)`) is not valid interval arithmetic per IEEE 1788-2015 and could violate the $\min \leq \max$ class invariant. For example, `[7, 12].mod([10, 10])` would produce `[7, 2]` where `min > max`.

If you need component-wise modulo on interval bounds, compose it explicitly:

```typescript
import { mod } from '@lenguados/math2d';
const result = Interval.fromValues(mod(a.min, b.min), mod(a.max, b.max));
// Caller is responsible for ensuring result.min <= result.max
```

---

## 10. Matrix2 Decompositions

`Matrix2.svd`, `Matrix2.pseudoInverse`, `Matrix2.polarDecompose`, `Matrix2.conditionNumber`, and `Rotation2.fromMatrix2Closest` share a closed-form 2×2 SVD kernel (Demmel-Kahan 1990 closed-form 2×2 SVD). Each has documented edge cases that diverge from the naive expectation.

### 10.1 SVD Sign Convention — Signed $\sigma_y$ (Convention A)

- **The expectation:** singular values are non-negative ($\sigma_x, \sigma_y \geq 0$) — the textbook convention.
- **The reality in `math2d`:** the package uses **Convention A**: $\sigma_x \geq 0$ always, but $\sigma_y$ may be negative when $\det(M) < 0$. Specifically, $\det(M) = \sigma_x \cdot \sigma_y$ holds as an exact algebraic identity, with the reflection sign absorbed into $\sigma_y$ rather than into $U$ or $V$.
- **The architecture:** $U$ and $V$ in the result are typed as `ReadonlyRotation2Like` and are guaranteed proper rotations ($\det(U) = \det(V) = +1$). Encoding the reflection sign in a singular value (rather than in the rotation factors) preserves the proper-rotation invariant of the result type and makes `Rotation2.fromMatrix2Closest` collapse to $R = U \cdot V^\top$ without a Kabsch sign-correction column flip.
- **Cross-convention consumer warning:** consumers reading `result.sigma.y` who plan to feed it into numerical software that follows the **unsigned-σ convention** ($\sigma_x \geq |\sigma_y| \geq 0$, sign carried by the right-hand factor $V$) MUST compare $(\sigma_x, |\sigma_y|)$ and reconcile the reflection sign against $\det(M)$. The signed-$\sigma$ Convention A used by `math2d` simplifies the orthogonal Procrustes problem (Schönemann 1966, Kabsch 1976) and the polar decomposition (Higham 2002 §5.5) because both factors $U$ and $V$ remain proper rotations.

### 10.2 Near-Singular Reconstruction Tolerance

- **The expectation:** $U \cdot \mathrm{diag}(\sigma) \cdot V^\top$ reconstructs $M$ to machine precision ($\approx 10^{-16}$).
- **The reality:** for matrices with condition number $\kappa(M) \gtrsim 10^{15}$, the reconstruction error scales with $\kappa \cdot \mathrm{EPSILON}_{\mathrm{machine}}$. At $\kappa = 10^{15}$, expect reconstruction error up to $\approx 10^{-1}$ in absolute terms — the smallest singular value carries no useful precision.
- **The architecture:** the Demmel-Kahan 1990 closed-form 2×2 SVD is numerically stable, but the limit is dictated by IEEE 754 double-precision arithmetic, not by the algorithm. Inputs above $\kappa \approx 10^{15}$ are effectively rank-1 in double precision.
- **The rule:** for ill-conditioned inputs use `Matrix2.conditionNumber(matrix)` first to detect the regime; treat $\kappa > 10^{12}$ as a flag for caller-side regularisation rather than relying on naive reconstruction.

### 10.3 SVD NaN Propagation

- **The expectation:** an SVD on `NaN` input throws or returns garbage.
- **The reality in `math2d`:** consistent with the package-wide NaN propagation policy (see §6), `Matrix2.svd` propagates NaN through every result component without throwing. `result.U.cos`, `result.U.sin`, `result.sigma.x`, `result.sigma.y`, `result.V.cos`, `result.V.sin` are all `NaN` when any input component is `NaN`.
- **Why no throw:** SVD is a pure-math operation. Throwing on NaN would force every caller to wrap the call in a try/catch even for transient NaN that flows through a longer pipeline. NaN propagation is detectable at the destination via `Number.isNaN(result.sigma.x)`.

### 10.4 `pseudoInverse` Rank-Deficient Handling

- **The expectation:** the pseudo-inverse of a singular matrix throws, since the regular inverse does.
- **The reality:** `Matrix2.pseudoInverse` uses the Moore-Penrose definition and applies a default tolerance $\tau = 2 \cdot |\sigma_{\max}| \cdot \mathrm{EPSILON}$ (Higham 2002 §5.5.5). Any singular value $|\sigma_i| \leq \tau$ is treated as zero, producing $1/\sigma_i = 0$ instead of a division-by-zero throw. The result is the unique Moore-Penrose pseudo-inverse, which satisfies the four Penrose axioms even for rank-deficient input.
- **The rule:** rely on `pseudoInverse` rather than `inverse` when input rank is unknown or when graceful degradation under singularity is desired (least-squares regression, IK solver fallback). For non-singular input, `pseudoInverse` and `inverse` produce equivalent results to machine precision.

### 10.5 `polarDecompose` Reflection-Correction

- **The expectation:** the polar decomposition $M = R \cdot S$ produces a proper rotation $R$ ($\det(R) = +1$) with a symmetric positive-semi-definite $S$ for every $M$.
- **The reality in `math2d`:** under Convention A, $R = U \cdot V^\top$ where both $U$ and $V$ are proper rotations, so $\det(R) = +1$ always. The reflection sign of $M$ is absorbed into $\sigma_y$, so $S = V \cdot \mathrm{diag}(\sigma) \cdot V^\top$ has $\det(S) = \sigma_x \cdot \sigma_y = \det(M)$. When $\det(M) < 0$, $S$ is **not** PSD — it is symmetric but indefinite.
- **The architecture:** this is the "Convention A polar decomposition" — distinct from the textbook polar where $R$ is allowed to be a reflection in exchange for $S$ being PSD. Convention A pushes the sign into the singular value rather than the rotation factor, preserving the proper-rotation invariant of the typed result. The symmetric-$S$ guarantee remains exact (`result.S.m01 === result.S.m10`) regardless of $\det(M)$.
- **Picking a decomposition:**
  - If the consumer requires $R$ proper rotation always (and accepts that $S$ may be indefinite for $\det(M) < 0$): use `Matrix2.polarDecompose` directly. This is the Convention A polar that `math2d` provides.
  - If the consumer requires $S$ PSD always (and accepts that $R$ may be a reflection for $\det(M) < 0$ — the textbook polar): reconstruct from the SVD result. Given `{ U, sigma, V } = Matrix2.svd(M)`, set `signY = sigma.y < 0 ? -1 : 1`, then form $R_{\text{textbook}} = U \cdot \mathrm{diag}(1, \mathrm{signY}) \cdot V^\top$ and $S_{\text{textbook}} = V \cdot \mathrm{diag}(\sigma_x, |\sigma_y|) \cdot V^\top$. Note that $R_{\text{textbook}}$ is a $2 \times 2$ orthogonal matrix (`ReadonlyMatrix2Like`), not a `ReadonlyRotation2Like` — the type widens because reflections are not rotations.
  - **Impossibility note:** for $\det(M) < 0$, no decomposition can satisfy both $\det(R) = +1$ AND $S$ PSD simultaneously, because $\det(M) = \det(R) \cdot \det(S)$ would force $\det(S) < 0$.

### 10.6 `closestRotation` Degenerate Cases

- **The expectation:** the closest proper rotation to the zero matrix is undefined (every rotation is equidistant).
- **The reality:** `Rotation2.fromMatrix2Closest(Matrix2.ZERO)` returns the identity rotation (`cos = 1, sin = 0`) deterministically. The Givens triangularisation fast-path (`m01 === 0`) produces $U = V = I$ and $\sigma = (0, 0)$; the composition $R = U \cdot V^\top$ collapses to identity. The returned object is a fresh `Rotation2` instance equivalent to `Rotation2.IDENTITY`, not the frozen constant itself.
- **The architecture:** this is a documented contract, not a fallback. The choice of identity over any other rotation is arbitrary — every proper rotation is equally close to the zero matrix in Frobenius norm. Callers requiring a different convention (for example throwing on degenerate input) MUST detect zero input upstream via `matrix.isZero()` or `Matrix2.frobeniusNorm(matrix) < EPSILON`.

### 10.7 `conditionNumber` — `+Infinity` on Singular Input

- **The expectation:** the condition number of a singular matrix is undefined.
- **The reality:** `Matrix2.conditionNumber(M)` returns `+Infinity` when $|\sigma_y| = 0$, per the IEEE 754 §7.2 division semantics ($\sigma_x / 0 = +\infty$ for $\sigma_x > 0$). NaN input produces NaN. The zero matrix produces NaN ($0 / 0$).
- **The architecture:** `+Infinity` is a deliberate signal — comparable via `result === Infinity` or `!Number.isFinite(result)` — that captures the "infinitely sensitive to perturbation" semantics of true singularity.
- **The rule:** test `Number.isFinite(kappa)` before using the result in arithmetic. Convention A signed $\sigma_y$ is normalised via `Math.abs` inside `conditionNumber`, so reflection inputs (e.g., $\mathrm{diag}(1, -1)$) correctly report $\kappa = 1$.

## 11. Interpolation Family Endpoint Contract

Every interpolation method in the package — the scalar `lerp` / `lerpClamped` / `smoothStep`, the angular `lerpAngle` / `lerpAngleClamped` / `smoothStepAngle`, and `lerp` / `lerpClamped` / `slerp` / `slerpClamped` / `smoothStep` on all seven core types — satisfies a single endpoint contract.

- **The contract:** at `t === 0` the result reproduces `a`, and at `t === 1` it reproduces `b`, as IEEE 754 bit-identical stored components (sign of zero, denormals, finite, and infinity all preserved). NaN propagates per IEEE 754-2019 §6.2.
- **Why a guard is required:** the affine kernel $a + (b - a) \cdot t$ is not endpoint-exact in IEEE 754. At $t = 1$ it can drift by up to 1 ULP, and when $b - a$ overflows to $\pm\infty$ the $t = 0$ evaluation becomes $\infty \cdot 0 = \mathrm{NaN}$ (IEEE 754-2019 §6.2 invalid operation). The scalar `lerp` therefore short-circuits both endpoints; `lerp(∞, ∞, 0) === ∞` depends on the `t === 0` guard firing before the subtraction.
- **Non-delegating kernels:** `slerp` (Vector2, Complex) and `Rotation2.lerp` route through a magnitude/angle round-trip (normalisation, `acos`/`atan2` → `sinCos`, re-multiplication) instead of a per-component scalar `lerp`, so they do not inherit the scalar guard. Each adds an explicit endpoint short-circuit that copies the input components directly. `Rotation2.lerp` uses **direct `cos`/`sin` assignment** because a re-normalising assignment perturbs the bits of any stored unit value whose $\mathrm{hypot}(\cos, \sin) \neq 1.0$.
- **`lerpAngle` non-finite case:** `lerpAngle(from, to, 0)` returns `from` even when `to` is non-finite — the guard fires before `angleDifference(from, to)` (which is `NaN` for non-finite `to`) reaches the $\mathrm{NaN} \cdot 0 = \mathrm{NaN}$ trap.
- **Rotation2 unit-input precondition:** the bit-exact endpoint guard copies the endpoint's `cos`/`sin` verbatim. `ReadonlyRotation2Like` is contractually a unit rotation; a non-unit `*Like` endpoint (for example `{ cos: 2, sin: 0 }`) is out of contract and is reproduced as-is rather than re-normalised.
- **Worked example:** `lerp(1e308, -1e308, 0) === 1e308` (the naive affine form yields `NaN`); `Rotation2.lerp(a, b, 0)` returns a rotation whose `cos`/`sin` are `===` those of `a`.
