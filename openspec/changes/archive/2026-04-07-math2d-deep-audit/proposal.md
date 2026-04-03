## Why

`@lenguados/math2d` has grown organically across six distinct layers, and no holistic review has validated that every constant, utility, and method is mathematically correct, properly named, non-redundant, and synergistic relative to the package's stated goal: to be the minimal, deterministic 2D math core upon which all future physics/geometry packages are built. This audit establishes a ground-truth specification for every export in the package — benchmarked against Box2D, three.js, gl-matrix, Godot, planck.js, Matter.js, Unity, and BABYLON.js — so that future contributors and consumers have an irrefutable contract.

## What Changes

- **Audit and re-specify** every constant, function, and method in every module of `packages/math2d/src/` against a canonical reference set drawn from major math and physics libraries.
- **Flag for removal** any export that has no real use-case within a pure 2D math core (no geometry primitives, no physics algorithms).
- **Flag for addition** any missing primitive that the reference libraries unanimously include and that downstream consumers will need for extension, composition, or facade.
- **Flag for rename or restructure** any export whose name, signature, or placement violates DRY, SOLID, or Clean Code principles, or that breaks layer dependencies.
- **Define instance/static symmetry rules** so each core type exposes a consistent dual API (static pure + instance-mutating) and `*CS`, `*Safe`, and `*Unchecked` triality where warranted.
- **Validate synergy**: confirm that lower-layer primitives are used by higher-layer operations, that hot-path variants (`*CS`, `out` params) exist for every expensive operation, and that no operation is duplicated across layers without clear reason.
- No **BREAKING** public-API changes are decided here — this proposal governs the audit; design.md will decide which findings become breaking changes.

## Capabilities

### New Capabilities

- `auxiliary-layer-audit`: Full specification of `auxiliary/scalar/`, `auxiliary/angle/`, and `auxiliary/numeric/` — every constant, function, and variant evaluated for correctness, completeness, naming, and synergy against reference libraries and the math2d design principles.
- `core-types-audit`: Full specification of `core/` types — `Vector2`, `Rotation2`, `Complex`, `Interval`, `Matrix2`, `Matrix3`, `Transform2` — covering static/instance symmetry, hot-path variants, mathematical completeness, and collaboration between types.
- `deterministic-kernels-audit`: Specification of `deterministic/` layer — fdlibm-based kernels (sin, cos, sqrt, atan2, etc.) including which functions belong at L0, their tolerance contracts, and which higher-layer operations must route through them.
- `types-and-interfaces-audit`: Specification of the `types/` layer — all `*Like` interfaces, type-guard functions, and the `SinCos` / `EigenvalueResult` utility types, evaluated for completeness and correct use of Readonly/mutable variance.
- `validation-layer-audit`: Specification of the `validation/` layer — assertion functions, tree-shaking architecture, and the strict/safe/unchecked triality surface area.
- `utils-layer-audit`: Specification of the `utils/` layer — formatting, parsing, random generation, and performance utilities, evaluated against the boundary: "belongs in a pure math core" vs. "belongs in a downstream package."
- `api-design-coherence`: Cross-cutting specification covering naming conventions, static vs. instance duality rules, `*CS`/`*Safe`/`*Unchecked` triality completeness, `out` parameter discipline, layer-dependency compliance, and synergy patterns across all modules.

### Modified Capabilities

<!-- No existing spec capabilities are being modified; all specs are net-new. -->

## Impact

- **Primary:** `packages/math2d/src/` — all six layers (`auxiliary/`, `core/`, `deterministic/`, `types/`, `validation/`, `utils/`)
- **Tests:** `packages/math2d/test/` — audit findings will surface missing test coverage and incorrect edge-case handling
- **Exports:** `packages/math2d/package.json` conditional exports and `src/index.ts` barrel may change if modules are added, removed, or restructured
- **Downstream:** `packages/examples/` may need updates if public API changes; `docs/` will require updates for any changed or removed symbols
- **Tree-shaking:** Validation layer and `utils/` changes may affect bundle sizes — all changes must preserve `"sideEffects": false` guarantee
- **Determinism guarantees:** Any change to `deterministic/` must be validated against L0 bit-exact contract; rollback path is to revert to original fdlibm coefficients
