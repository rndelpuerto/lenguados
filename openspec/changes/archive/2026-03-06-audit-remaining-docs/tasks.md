## 1. P0 — Fix layer diagram in core_principles.md

- [x] 1.1 Read `packages/math2d/docs/architecture/core_principles.md` and locate the layer diagram (NIVEL 1-5)
- [x] 1.2 Move `deterministic-kernels.ts` from NIVEL 5 to NIVEL 0 (base layer)
- [x] 1.3 Renumber remaining levels to match the actual DAG: deterministic(L0) → auxiliary(L1) → core(L2-L3) → utils(L4)
- [x] 1.4 Preserve Spanish language in all edits

## 2. P0 — Fix dependency arrows in .claude/rules/math2d-patterns.md

- [x] 2.1 Read `.claude/rules/math2d-patterns.md` Layer Dependencies section
- [x] 2.2 Change arrows to use `→` with explicit "imports flow right-to-left" legend
- [x] 2.3 Verify the description matches the actual import graph

## 3. P1 — Remove ANGLE_EPSILON from CLAUDE.md

- [x] 3.1 In `CLAUDE.md`, remove `ANGLE_EPSILON = 1e-12` from the tolerances line (approx line 87)

## 4. P1 — Remove sqrt from deterministic kernel lists in docs

- [x] 4.1 In `packages/math2d/CONTRIBUTING.md` line 12, remove `sqrt` from "Use `deterministic-kernels` for trig/sqrt"
- [x] 4.2 In `packages/math2d/CONTRIBUTING.md` line 41, remove `sqrt` from the list of deterministic implementations
- [x] 4.3 In `packages/math2d/docs/architecture/core_principles.md` line 145, remove `sqrt` from the transcendental functions list
- [x] 4.4 Add a note that `Math.sqrt` is IEEE 754 required (deterministic by standard) wherever appropriate

## 5. P1 — Fix slerp → lerp in decisions_and_benchmarks.md

- [x] 5.1 In `packages/math2d/docs/research/decisions_and_benchmarks.md` lines 31-34, change `Rotation2.slerp` to `Rotation2.lerp`

## 6. Verification

- [x] 6.1 Grep for remaining references to `ANGLE_EPSILON` in all docs and config files
- [x] 6.2 Grep for references to `deterministic.*sqrt` (custom sqrt) in docs — should be zero
- [x] 6.3 Grep for `Rotation2.slerp` in docs — should be zero
- [x] 6.4 Verify `.claude/rules/math2d-patterns.md` layer arrows match the ARCHITECTURE.md Mermaid diagram
