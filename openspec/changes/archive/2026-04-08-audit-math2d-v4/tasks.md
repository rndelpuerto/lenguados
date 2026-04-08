# Audit v4 — Implementation Tasks

Empirically verified. Every code change has a concrete test expression proving the bug and the fix.

## Spec: rounding-fix

- [x] **Task 1: Fix floorPowerOfTwo** — Replace `return 2 ** Math.floor(log(value) / LN_2)` with comparison-based validation in `packages/math2d/src/auxiliary/numeric/rounding.ts:181-184`. Add tests for values 1 ULP below powers of 2. Proof: `floorPowerOfTwo(3.9999999999999996)` must return `2` (currently returns `4`).
- [x] **Task 2: Fix ceilPowerOfTwo** — Replace snap-correction approach with floor-based computation in `packages/math2d/src/auxiliary/numeric/rounding.ts:155-161`. Add tests for values 1 ULP above powers of 2. Proof: `ceilPowerOfTwo(1024 + 1e-8)` must return `2048` (currently returns `1024`).

## Spec: rotation2-fromcomplex-type

- [x] **Task 3: Change Rotation2.fromComplex parameter type** — In `packages/math2d/src/core/rotation2.ts`, change `fromComplex` (line ~471) and `fromComplexSafe` (line ~499) parameter type from `ReadonlyComplex` to `ReadonlyComplexLike`. Add `ReadonlyComplexLike` to the types import (line 70-75), remove `type ReadonlyComplex` from complex import (line 78).

## Spec: architecture-doc-fix

- [x] **Task 4: Redraw ARCHITECTURE.md dependency graph** — Fix Mermaid diagram in `packages/math2d/ARCHITECTURE.md` with 7 missing edges + 2 reversed edges. Update prose descriptions for each layer's dependencies.
- [x] **Task 5: Fix architecture-and-layers.md** — Update `.claude/rules/architecture-and-layers.md` to document validation as cross-cutting concern (imported by Core and Utils, imports only Types). Fix the layer graph.
- [x] **Task 6: Reconcile code-style.md member ordering** — Update `.claude/rules/code-style.md` member ordering section to match `tsdoc-conventions.md` (which all source code actually follows).

## Spec: dx-docs-improvements

- [x] **Task 7: Add @remarks to instance transformDirectionCS** — In `packages/math2d/src/core/transform2.ts` instance method (line ~1701), add @remarks documenting parameter order difference from siblings transformPointCS/transformVectorCS. Static already has this docs (lines 868-871).
- [x] **Task 8: Add @remarks to Complex.addScalar** — In `packages/math2d/src/core/complex.ts`, add @remarks cross-referencing Vector2.addScalar behavioral difference (Complex adds to real only, Vector2 adds to both).
