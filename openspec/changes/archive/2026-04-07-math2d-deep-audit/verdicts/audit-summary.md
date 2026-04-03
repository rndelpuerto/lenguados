# Math2D Deep Audit — Final Summary

This document lists only the actionable (non-KEEP) verdicts from the full audit. All other exports received a KEEP verdict.

**Audit scope**: All 23 source files in `packages/math2d/src/` read line-by-line across two prior passes plus the final integration pass.

**Adversarial review result**: 14 initially-flagged issues were retracted after adversarial review. 3 real issues survived (down from 4: `Vector2.refract` deferred — encodes Snell's law physics, belongs in a future rendering package built on top of math2d, not in the core math layer).

---

## 1. RESTRUCTURE Verdicts

### R1 — `utils/performance.ts` → `@lenguados/devtools`

| Field    | Detail                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Module   | `packages/math2d/src/utils/performance.ts`                                                                                                                                     |
| Exports  | `timestamp`, `Measurement<T>`, `measure`, `measureAsync`, `recordMeasurement`, `MeasurementCollector`                                                                          |
| Problem  | Zero math imports. All utilities are generic development-time profiling tools with no mathematical purpose. Increases bundle size for consumers who only need math primitives. |
| Target   | New `@lenguados/devtools` package (migration plan already documented in `@migration` TSDoc block in the file)                                                                  |
| Priority | P3 — Deferred to v2.0 per TSDoc. No behavioral bug, only package placement.                                                                                                    |

---

## 2. RENAME Verdicts

None. No naming issues survived adversarial review.

---

## 3. REMOVE Verdicts

None. No dead code or unjustified complexity survived adversarial review.

---

## 4. Targeted Fixes

### F1 — Remove `export` from `pow2`

| Field  | Detail                                                                                                                                                                                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File   | `packages/math2d/src/deterministic/deterministic-kernels.ts` line 194                                                                                                                                                                                                             |
| Change | `export function pow2` → `function pow2`                                                                                                                                                                                                                                          |
| Why    | Zero external callers. Only `exp()` (lines 893–894) and its own recursive subnormal guard (line 197) call it. It is a private implementation step of `exp()` range reduction. The `export` is an oversight — the `@internal` tag at line 183 already reflects the correct intent. |
| Risk   | None. No callers outside the file. Not in `DeterministicKernels` namespace.                                                                                                                                                                                                       |

### F2 — Fix `@internal` tag and stale TSDoc on `logKernelSafe`

| Field                      | Detail                                                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File                       | `packages/math2d/src/deterministic/deterministic-kernels.ts` lines 831–834                                                                                                                                                                                         |
| Change                     | Remove `@internal` tag. Rewrite `@remarks` to accurately describe the function's role.                                                                                                                                                                             |
| Why — `@internal` is wrong | `logKernelSafe` is explicitly included in the `DeterministicKernels` public namespace (line 998) alongside `expSafe`, `acosSafe`, `asinSafe` — all public. Every other `*Safe` kernel has no `@internal`. The tag contradicts the function's actual public status. |
| Why — TSDoc is stale       | The `@remarks` claims `safety.ts` delegates to this kernel, but `safety.ts` line 15 imports `log` directly: `import { acosSafe, asinSafe, log, pow }`. The described delegation chain does not exist.                                                              |
| Correct role               | The deterministic layer's single-argument safe log — analogous to `expSafe` for `exp`. For consumers using `DeterministicKernels` directly without the auxiliary layer.                                                                                            |
| Risk                       | None. No API change.                                                                                                                                                                                                                                               |

---

## Issue Count by Priority

| Priority                    | Count | Issues                                     |
| --------------------------- | ----- | ------------------------------------------ |
| P1 (breaking risk / bug)    | 0     | —                                          |
| P2 (targeted fix)           | 2     | F1 (pow2 export), F2 (logKernelSafe TSDoc) |
| P3 (nice-to-have, deferred) | 1     | R1 (performance.ts migration)              |

---

## What Was Retracted or Deferred (Do NOT Re-open)

**Deferred by design scope:**

- `Vector2.refract` — ADD verdict deferred. Encodes Snell's law (physics of materials, `eta` = ratio of refractive indices). The paquete is purely core math; physics algorithms go in packages built on top of it.

**Cleared by adversarial review:**

- `SMALLEST_NORMAL` placement — correctly in `constants.ts`
- `acosSafe`/`asinSafe` layer placement — correctly in `auxiliary/numeric/safety.ts`
- `remapUnchecked` absent — intentional (range check is the work, can't be skipped)
- `AngleUnwrapper` not exported — it IS exported via `auxiliary/angle/index.ts` line 19
- `utils/random` importing `validation/` — architecture explicitly allows it (cross-cutting)
- `config.useNativeMath` safety — single-threaded JS; documented "set once at startup"
- `getLengthAndNormalize` allocation — V8 stack-allocates; `unit` reuses `out` param
- `MIN_SAFE_DIVISOR` duplicating `EPSILON` — intentionally distinct with different purposes
- `fromMatrix3` undocumented scale loss — explicitly documented in TSDoc
- `Complex.apply` normalization inconsistency — intentional operator semantics
- `Matrix3` overengineering — each advanced method has documented mathematical purpose
- `Transform2` missing instance `multiply()` — EXISTS at `transform2.ts` line 1949
- `cross3` zComponent confusion — takes THREE points, computes signed triangle area (correct)
- `Vector2.smootherStep` absent from Vector2 class — intentionally in `auxiliary/scalar` only
- `Matrix2` rotation constants without callers — exist for discoverability, not dead code
