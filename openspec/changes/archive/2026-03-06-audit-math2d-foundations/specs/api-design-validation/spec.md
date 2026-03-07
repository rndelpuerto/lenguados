## ADDED Requirements

### Requirement: Static + instance duality validated against industry patterns

The current pattern (static methods are pure, instance methods mutate `this` and return `this`)
SHALL be validated against:

1. **gl-matrix**: All functional, out parameter, no classes → pure performance
2. **three.js**: All OOP, instance methods mutate and return `this` → pure DX
3. **Unity.Mathematics**: Value-type structs, static functions, no mutation → SIMD/Burst-friendly
4. **Eigen**: Expression templates, lazy evaluation → compile-time optimization
5. **nalgebra**: Owned + borrowed patterns, no hidden mutation → Rust safety
6. **Box2D**: C-style structs + free functions → simple, predictable

The audit SHALL document which approach best serves a JS/TS math library for physics
engines and justify the hybrid static+instance choice.

#### Scenario: Hybrid approach justified against alternatives

- **WHEN** the audit evaluates the static+instance hybrid
- **THEN** it SHALL produce a comparison table covering: allocation cost, API discoverability, chainability, hot-path suitability, TypeScript ergonomics, and tree-shaking behavior for each approach

#### Scenario: Instance mutation is the correct default for JS

- **WHEN** the audit evaluates whether instance methods should mutate `this` vs return new
- **THEN** it SHALL cite V8's object allocation cost, hidden class optimization patterns, and compare the approach of three.js (mutate) vs immutable alternatives (immer-style), documenting GC pressure implications

---

### Requirement: Out parameter pattern validated against allocation strategies

The `out?` parameter pattern (optional last parameter for reusable output) SHALL be validated against:

1. **gl-matrix**: Mandatory `out` first parameter → forced zero-allocation
2. **three.js**: No `out`, always returns `this` or new → allocation per operation
3. **Unity.Mathematics**: Value types, no allocation issue → N/A for reference types
4. **cannon.js / ammo.js**: Object pools → centralized allocation management
5. **Rapier**: Wasm memory, no JS allocation → different paradigm

#### Scenario: Optional out is the right tradeoff for JS/TS

- **WHEN** the audit evaluates optional vs mandatory `out`
- **THEN** it SHALL document: developer friction of mandatory `out` (gl-matrix feedback), allocation cost of no `out` (three.js profiling), and justify optional as the compromise, citing specific benchmark data or published analysis

#### Scenario: Out parameter position validated

- **WHEN** the audit evaluates `out` as last parameter vs first (gl-matrix style)
- **THEN** it SHALL cite TypeScript optional parameter constraints (optional params must be last), developer expectation surveys, and API discoverability as justification for last-position

---

### Requirement: \*Like interface pattern validated for duck-typing ergonomics

The `Readonly*Like` / `*Like` interface pattern (accepting POJOs as input) SHALL be validated against:

1. **three.js**: Accepts own types only → no interop
2. **gl-matrix**: Uses Float32Array/Float64Array → typed array interop
3. **Eigen**: Template-based → compile-time duck typing
4. **Unity.Mathematics**: Strict value types → no duck typing
5. **nalgebra**: Trait-based → explicit interface implementation

#### Scenario: Duck-typing justified for TypeScript ecosystem

- **WHEN** the audit evaluates \*Like interfaces
- **THEN** it SHALL document the TypeScript structural typing advantage (no explicit implements needed), JSON deserialization ergonomics, and interop with other libraries, citing real use cases where POJOs flow through the API

#### Scenario: Readonly vs mutable split justified

- **WHEN** the audit evaluates the ReadonlyVector2Like / Vector2Like split
- **THEN** it SHALL cite TypeScript's `exactOptionalPropertyTypes` behavior, `readonly` modifier semantics, and whether the split provides real safety or is purely cosmetic, comparing against nalgebra's owned/borrowed distinction

---

### Requirement: Triality pattern (Strict/Safe/Unchecked) validated

The three-tier error handling pattern SHALL be validated against:

1. **Rust's approach**: `unwrap()` (panic), `unwrap_or(default)`, unchecked via `unsafe` → similar triality
2. **C++ Eigen**: Assertions in debug, undefined in release → two tiers
3. **gl-matrix**: No validation, all unchecked → one tier
4. **three.js**: Silent NaN propagation → no explicit error handling
5. **Unity.Mathematics**: Burst compilation removes checks → conditional like validation layer
6. **Box2D**: `b2Assert` in debug → two tiers
7. **Rapier**: Rust's Result type → two tiers (Ok/Err)

#### Scenario: Three tiers justified over two

- **WHEN** the audit evaluates strict+safe+unchecked vs strict+unchecked
- **THEN** it SHALL document real use cases for Safe (fallback without try/catch in hot paths), citing physics engine patterns where NaN propagation is worse than a fallback value

#### Scenario: Naming convention validated

- **WHEN** the audit evaluates `opSafe` suffix vs `safeOp` prefix vs `op_or(fallback)`
- **THEN** it SHALL cite Rust naming conventions (`checked_add`, `wrapping_add`, `saturating_add`), GLSL function variants, and justify the suffix pattern for discoverability and autocomplete grouping

---

### Requirement: \*CS variant pattern validated for pre-computed trigonometry

The `*CS(cos, sin)` variant pattern SHALL be validated against:

1. **GLSL**: Built-in `sincos` + manual pass → same concept, different syntax
2. **Unity.Mathematics**: `math.sincos` → returns both, user passes
3. **Godot**: `Vector2.rotated(angle)` only → no pre-computed variant
4. **gl-matrix**: `mat2.fromRotation(out, rad)` → always computes inline

#### Scenario: CS variants justified for hot paths

- **WHEN** the audit evaluates whether CS variants provide measurable benefit
- **THEN** it SHALL document the cost of `sin`+`cos` (fdlibm polynomial evaluation) vs passing pre-computed values, and identify the breakeven point (N operations sharing one angle) where CS variants become worthwhile

#### Scenario: CS naming convention evaluated

- **WHEN** the audit evaluates `rotateCS(cos, sin)` naming
- **THEN** it SHALL compare against alternatives (`rotatePrecomputed`, `rotateSinCos`, `rotateWithCS`) and justify the chosen convention for brevity and discoverability

---

### Requirement: Chaining pattern evaluated for API ergonomics

The fluent chaining pattern (instance methods return `this`) SHALL be validated against:

1. **three.js**: Full chaining → `v.add(a).normalize().multiplyScalar(2)` — most popular JS 3D lib
2. **gl-matrix**: No chaining → `normalize(out, add(out, a, b))` — functional composition
3. **D3.js**: Chaining for builder patterns → well-established JS idiom
4. **jQuery**: Chaining pioneer → proven DX pattern in JS ecosystem

#### Scenario: Chaining ergonomics validated

- **WHEN** the audit evaluates method chaining
- **THEN** it SHALL document: readability of chains vs nested calls, debuggability (intermediate values), IDE support (autocomplete after `.`), and cite three.js's success as evidence of developer adoption

#### Scenario: Chaining and mutation combined safely

- **WHEN** the audit evaluates `this`-mutation + chaining
- **THEN** it SHALL document the risk of aliasing bugs (e.g., `a.add(a)` — is `a` read before mutation?) and how reference libraries handle this, citing three.js's documentation on in-place operations

---

### Requirement: apply vs transform semantic distinction validated

The semantic distinction between `apply` (operator acts on operand) and `transform` (spatial
coordinate transformation) SHALL be validated against:

1. **Eigen**: `operator*` for all → no semantic distinction
2. **Unity.Mathematics**: `math.mul` for all → no semantic distinction
3. **three.js**: `applyMatrix4`, `applyQuaternion` → uses "apply" for both
4. **Godot**: `Transform2D.xform(v)` → dedicated verb
5. **Box2D**: `b2Mul(A, B)` → single verb for all compositions

#### Scenario: Semantic distinction justified

- **WHEN** the audit evaluates `apply` vs `transform` distinction
- **THEN** it SHALL document whether the distinction aids or confuses developers, citing API usability principles (consistency vs precision) and comparing against the single-verb approach of most reference libraries

#### Scenario: Verb assignment is consistent

- **WHEN** the audit audits all methods using `apply` or `transform` verbs
- **THEN** it SHALL verify that the assignment follows the documented rule without exceptions, or document justified exceptions

---

### Requirement: Constructor and factory patterns validated

The current pattern (constructors + static `from*` factories) SHALL be validated against:

1. **gl-matrix**: `vec2.create()`, `vec2.fromValues(x, y)` → named factories only
2. **three.js**: `new Vector3(x, y, z)` → constructor with parameters
3. **Unity.Mathematics**: `new float2(x, y)` → constructor, `float2.zero` → constant
4. **Eigen**: `Vector2d(x, y)` → constructor, `Vector2d::Zero()` → factory
5. **nalgebra**: `Vector2::new(x, y)` → constructor, `Vector2::zeros()` → factory

#### Scenario: Factory naming convention validated

- **WHEN** the audit evaluates `from*` naming (fromValues, fromAngle, fromArray, fromObject)
- **THEN** it SHALL cite Rust `from` convention, Java `of/from` convention, and JavaScript `Array.from` / `Object.fromEntries` as precedent, and evaluate whether the naming is consistent and discoverable

#### Scenario: Constructor vs factory role clarified

- **WHEN** the audit evaluates when to use `new Type(...)` vs `Type.from*()`
- **THEN** it SHALL document the rule (constructor for raw component values, factories for semantic construction) and verify consistency across all 7 core types
