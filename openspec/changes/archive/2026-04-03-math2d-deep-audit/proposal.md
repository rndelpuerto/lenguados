## Why

The @lenguados/math2d package has grown to ~94K lines across 31 source files spanning 6 architectural layers. No systematic, line-by-line audit has been conducted to verify that every constant, utility function, and method is mathematically correct, properly placed within its module, follows consistent patterns, and creates genuine synergy with the rest of the codebase. Before building higher-level packages (geometry, physics) on top of this foundation, we need absolute confidence that the math2d base is rock-solid, complete where it needs to be, and free of over-engineering.

## What Changes

- **Audit every module line-by-line** across all 6 layers: deterministic, auxiliary (scalar/numeric/angle), core (Vector2/Complex/Rotation2/Interval/Matrix2/Matrix3/Transform2), types, validation, and utils
- **Contrast each constant, function, and method against reference libraries** (glm, Box2D, Matter.js, Rapier, nalgebra, Godot, Unity, Eigen, p5.js, three.js, gl-matrix) to establish what should exist, what's missing, what's redundant, and what needs correction
- **Verify mathematical correctness and robustness** of every operation
- **Assess static/instance symmetry** and method collaboration within and across modules
- **Identify over-engineering, DRY violations, SOLID violations, and Clean Code issues**
- **Evaluate synergy**: can each element serve as a building block for composition, extension, or facade patterns by downstream packages?
- **Validate module boundaries**: each module's responsibility scope, no geometry or physics algorithms leaking in
- **Produce actionable findings**: define, redefine, remove, or improve — with clear rationale from reference library comparison

## Capabilities

### New Capabilities

- `auxiliary-layer-audit`: Comprehensive audit of all auxiliary modules — scalar (constants, arithmetic, comparison, interpolation), numeric (guards, rounding, safety, wrapping), and angle (conversion, interpolation, normalization, operations, unwrapping). Covers mathematical correctness, completeness, naming, cross-module synergy, and reference library comparison.
- `core-types-audit`: Deep audit of all core math types — Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2. Covers API completeness, static/instance symmetry, method collaboration, mathematical correctness, hot-path optimizations, and comparison with reference implementations.
- `infrastructure-audit`: Audit of supporting layers — deterministic kernels (fdlibm), type interfaces (\*Like), validation (assert tiers), and utils (parse, random, performance). Covers correctness, necessity, and integration with core/auxiliary layers.
- `api-conventions-audit`: Cross-cutting audit of API design patterns — naming consistency, out-parameter usage, \*CS variants, Strict/Safe/Unchecked triality, chaining patterns, DRY compliance, SOLID principles, and Clean Code adherence across the entire package.
- `reference-library-comparison`: Systematic comparison against 10+ established math/physics libraries to build an irrefutable catalog of what a 2D math foundation should contain, identifying gaps, redundancies, and opportunities.

### Modified Capabilities

<!-- No existing specs are being modified — this is a greenfield audit -->

## Impact

- **Affected code**: All source files in `packages/math2d/src/` (31 files, ~94K lines)
- **Affected layers**: All 6 architectural layers (deterministic → auxiliary → core → types → validation → utils)
- **APIs**: Findings may recommend API additions, removals, renames, or signature changes — all potentially **BREAKING**
- **Dependencies**: May identify missing or unnecessary internal cross-layer dependencies
- **Downstream**: All findings directly impact the design of future geometry and physics packages that will build on math2d
- **Bundle size**: Audit will assess tree-shaking effectiveness and identify dead code
- **Deterministic guarantees**: Any recommended changes must preserve L0 bit-exact determinism; rollback plan is to revert to pre-audit commit if determinism is compromised
