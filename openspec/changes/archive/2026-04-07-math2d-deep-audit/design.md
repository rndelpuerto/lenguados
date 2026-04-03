## Context

`@lenguados/math2d` is a six-layer deterministic 2D math library for physics engine foundations. At v0.6.0, the package has grown to ~40 source modules with ~200 exports across `auxiliary/`, `core/`, `deterministic/`, `types/`, `validation/`, and `utils/`. No comprehensive cross-reference audit has been performed against the canonical math and physics library landscape (Box2D, gl-matrix, three.js, Godot, planck.js, Matter.js, Unity, BABYLON.js).

The audit is driven by reading every source line without assumptions and comparing against the reference landscape. The process uses a tiered agent architecture to eliminate bias:

1. **Investigative agents** — read each module line-by-line and produce findings without pre-judging
2. **Adversarial agents** — challenge every finding with counter-evidence from reference libraries
3. **Integrator agents** — synthesize contested findings into a final verdict per module
4. **Documentation agents** (second pass) — re-run the same architecture but also read the library's own TSDoc and architecture docs to accept or refute synthesis findings

## Goals / Non-Goals

**Goals:**

- Produce a spec file per capability that defines the post-audit state of that layer
- Identify every export that should be removed, renamed, added, or restructured
- Confirm that all inter-module synergy paths are real and used (not just available)
- Validate that hot-path variants (`*CS`, `out` param) exist for every costly operation
- Confirm the static/instance duality contract is complete for all core types
- Ensure the strict/safe/unchecked triality is consistently applied
- Confirm layer dependency rules are not violated anywhere
- Benchmark every constant, utility, and method against at least three reference libraries

**Non-Goals:**

- Adding geometry types (shapes, AABB, circles, polygons) — these go in downstream packages
- Adding physics algorithms (broadphase, collision detection, constraint solving)
- Changing the fdlibm polynomial coefficients or L0 determinism strategy
- Rewriting the build system, test infrastructure, or CI/CD pipeline
- Changing the tree-shaking export strategy (conditional `development` vs `default`)

## Decisions

### D1: Multi-pass agent architecture over single static analysis

**Decision:** The audit uses a structured three-phase human-readable review: investigative → adversarial → integrative. No regex/AST automation for semantic judgments.

**Rationale:** Regex and AST tools identify syntactic patterns but miss semantic errors — an operation may look correct but be mathematically wrong, named misleadingly, or placed in the wrong layer. Adversarial review catches over-eager removals and under-eager additions that a single-pass review misses.

**Alternative considered:** ESLint custom rules + automated API diffing. Rejected because they cannot assess mathematical correctness, reference-library conventions, or semantic synergy.

### D2: Reference library benchmark set

**Decision:** Primary benchmarks are Box2D (b2Vec2/b2Rot/b2Transform), gl-matrix (vec2/mat3), Godot (Vector2/Transform2D), three.js (Vector2/Matrix3), and planck.js. Secondary benchmarks: Matter.js, Unity, BABYLON.js.

**Rationale:** Box2D and planck.js define the physics-engine standard for 2D; gl-matrix defines the functional out-parameter pattern; Godot defines the game-engine ergonomics standard; three.js is the most-used web graphics library. Together they cover the full design-philosophy spectrum.

**Why not just Box2D:** Box2D is the target physics layer but its C++ API is not directly portable to TypeScript math primitives. The multi-library benchmark eliminates single-library bias.

### D3: Five-class verdict system

**Decision:** Each audited export receives one verdict: **KEEP** / **REMOVE** / **RENAME** / **ADD** / **RESTRUCTURE**.

- **KEEP**: Mathematically correct, well-named, properly placed, synergistic
- **REMOVE**: No real use-case in a pure 2D math core; not found in ≥3 reference libraries
- **RENAME**: Correct semantics but wrong name (naming inconsistency, wrong convention)
- **ADD**: Missing from current codebase but required by ≥3 reference libraries or needed for hot-path composition
- **RESTRUCTURE**: Move to a different layer or split into sub-variants

**Rationale:** A binary keep/remove verdict loses too much nuance. RENAME and RESTRUCTURE are common findings in organic codebases and must be actionable separately from correctness concerns.

### D4: Breaking-change policy

**Decision:** The audit specs define WHAT the post-audit state SHALL be. Breaking changes are explicitly marked in tasks.md. Any export receiving a REMOVE or RENAME verdict is a **BREAKING** change per semver. All breaking changes are batched into a single major version bump.

**Rationale:** Incremental removals/renames fragment the changelog and force consumers to migrate repeatedly. A single breaking release (e.g., v1.0.0) is cleaner and communicates stability.

### D5: Synergy validation via dependency tracing

**Decision:** For every lower-layer primitive (auxiliary, deterministic), the audit traces which core methods actually call it. Primitives with zero upstream callers are candidates for REMOVE unless they provide documented extension points.

**Rationale:** A primitive that nobody calls is not providing synergy — it is dead code masquerading as an API. The test suite alone calling a function does not count as a "real use" unless the test validates a consumer contract.

### D6: Hot-path completeness rule

**Decision:** Every core operation that internally computes `sin`/`cos` SHALL have a `*CS` (cos/sin pre-computed) variant. Every operation that allocates a result object SHALL accept an optional `out` parameter. Audit findings for missing `*CS` or missing `out` are classified as **ADD**.

**Rationale:** Box2D's b2Rot stores pre-computed sin/cos precisely because rotation is computed in tight loops. The `*CS` pattern already exists in the library but may not be complete. The `out` parameter pattern (from gl-matrix) is already used but coverage is unknown.

### D7: Layer dependency enforcement

**Decision:** Any import discovered to flow upward (e.g., `core/` importing `validation/`, or `auxiliary/` importing `core/`) is a **RESTRUCTURE** finding regardless of whether tests pass.

**Rationale:** The strict layered architecture is the primary isolation guarantee. Layer violations create hidden coupling that prevents tree-shaking and breaks the determinism contract.

## Risks / Trade-offs

- **[Risk] Audit scope creep**: Seven capability specs across 40+ modules risk becoming an open-ended rewrite. → Mitigation: Each spec produces a bounded verdict list. Implementation is deferred to follow-on PRs; the audit itself produces no code changes.
- **[Risk] False REMOVE verdicts**: An export used only by downstream packages (not the library itself) may look unused in dependency traces. → Mitigation: Adversarial agents explicitly check `packages/examples/` and any external documentation for usage evidence.
- **[Risk] Reference library bias**: Over-relying on a single library (e.g., three.js) may push the API toward 3D graphics concerns. → Mitigation: Verdicts require consensus from ≥3 reference libraries across different domains (physics + graphics + game engine).
- **[Risk] Determinism regression**: Any modification to `deterministic/` may break the L0 bit-exact contract. → Mitigation: The `deterministic-kernels-audit` spec explicitly bans changes to fdlibm polynomial coefficients. Only structural/naming changes are permitted.
- **[Risk] Over-engineering trap**: Audit findings may over-specify APIs (adding variants for every edge case). → Mitigation: SOLID + DRY constraints are explicit in every spec. An ADD finding requires evidence from ≥2 reference libraries.

## Migration Plan

1. **Phase 0 (this change):** Produce all audit specs. No code changes.
2. **Phase 1:** Implement RESTRUCTURE verdicts (layer violations, file moves). No API changes.
3. **Phase 2:** Implement RENAME verdicts. These are breaking — batch into a single commit with deprecation aliases temporarily.
4. **Phase 3:** Implement REMOVE verdicts. These are breaking — batch with Phase 2 into the same major release.
5. **Phase 4:** Implement ADD verdicts (new operations, new `*CS` variants, missing `out` params). Non-breaking.
6. **Release:** One major version bump covering Phases 2–3. Phases 1 and 4 can be minor/patch.

**Rollback:** Because Phase 0 produces only documentation, it is always safe to roll back by discarding the change directory. For code phases, git revert covers each phase independently.

## Open Questions

- **OQ1:** Should `utils/performance` be moved to `@lenguados/common` or kept in math2d? It has no math dependency.
- **OQ2:** Should `EigenvalueResult` types (in `types/`) remain in math2d if no geometry or physics algorithm uses eigenvalues at this layer?
- **OQ3:** Should the `AngleUnwrapper` stateful class live in `auxiliary/angle/` or be promoted to a standalone module? It has state, unlike all other auxiliary exports.
- **OQ4:** Is `SMALLEST_NORMAL` (2.225e-308) a constant needed by any operation in this library, or is it an infrastructure constant that belongs in `numeric/guards`?
- **OQ5:** `sinCos` and `sinCosNormalized` in `auxiliary/angle/operations` — should these route through `deterministic/` to guarantee L0 bit-exact results?
