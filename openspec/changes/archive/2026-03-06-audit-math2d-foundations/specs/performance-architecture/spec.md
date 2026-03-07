## ADDED Requirements

### Requirement: Object allocation patterns validated against V8 optimization

The library's allocation strategy (out parameter, instance mutation, frozen constants) SHALL be
validated against V8 engine optimization documentation:

1. **Hidden classes**: Whether the core types maintain stable hidden classes (monomorphic property access)
2. **Inline caching**: Whether the static+instance pattern supports V8's inline caching
3. **GC pressure**: Whether the out parameter measurably reduces GC pauses in sustained loops
4. **Object shape stability**: Whether constructors initialize all properties in consistent order

These SHALL be validated against Vyacheslav Egorov's V8 internals articles, the V8 blog on
hidden classes and inline caches, and published gl-matrix vs three.js benchmark comparisons.

#### Scenario: Core types have stable hidden classes

- **WHEN** the audit examines constructor patterns for all 7 core types
- **THEN** each constructor SHALL initialize all numeric properties in the same order on every call path, and no conditional property addition SHALL exist, citing V8's hidden class transition documentation

#### Scenario: Out parameter reduces GC pressure

- **WHEN** the audit designs a benchmark comparing `Vector2.add(a, b)` (allocating) vs `Vector2.add(a, b, out)` (reusing)
- **THEN** it SHALL document the expected GC pressure difference, citing gl-matrix's benchmark methodology and published results showing allocation-free APIs reduce GC pauses by measurable amounts in sustained loops

#### Scenario: Frozen objects and hidden classes

- **WHEN** the audit evaluates `Object.freeze()` on constant instances (Vector2.ZERO, etc.)
- **THEN** it SHALL document whether frozen objects cause V8 to create separate hidden classes (performance penalty) or are optimized by modern V8 versions, citing V8 blog posts on frozen objects

---

### Requirement: Pre-computed cos/sin (\*CS) variants benchmarked

The `*CS` variant pattern (pre-computed cos/sin) SHALL be evaluated with benchmarks:

1. **Cost of fdlibm sin/cos**: Measure the per-call cost of deterministic sin/cos
2. **Breakeven point**: Determine N (number of operations sharing one angle) where CS variants are faster
3. **Real-world scenarios**: Identify concrete use cases (particle systems, physics ticks, batch transforms)
4. **Comparison**: How do reference engines handle this? (Unity pre-computes in Transform, three.js recomputes each call)

#### Scenario: fdlibm trig cost measured

- **WHEN** the audit benchmarks deterministic sin(x) and cos(x)
- **THEN** it SHALL document the per-call cost in nanoseconds, comparing against native Math.sin/Math.cos, citing the expected ~2-10x overhead of polynomial evaluation vs platform-optimized libm

#### Scenario: CS breakeven documented

- **WHEN** the audit determines the breakeven point
- **THEN** it SHALL document: "Pre-computing sinCos and using \*CS variants is faster than calling rotate(angle) when N > [breakeven]", with benchmark data and methodology

#### Scenario: Particle system use case validated

- **WHEN** the audit evaluates a particle system scenario (1000 particles, same rotation per frame)
- **THEN** it SHALL estimate the per-frame savings of sinCos + rotateCS vs 1000x rotate(angle), citing realistic particle counts from game engine documentation

---

### Requirement: Tree-shaking effectiveness validated

The conditional export strategy (development vs production builds) SHALL be validated for:

1. **Validation code elimination**: Are assertions truly removed from production bundles?
2. **Dead code elimination**: Does the `__LENGUADOS_DEV__` constant work with Rollup, Webpack, esbuild?
3. **Module side effects**: Does `moduleSideEffects: false` work correctly with the library's exports?
4. **Bundle size impact**: What is the bundle size with and without validation code?

These SHALL be validated against the Rollup documentation on conditional compilation, the esbuild
`define` feature, and the Webpack DefinePlugin approach.

#### Scenario: Assertions removed in production

- **WHEN** the library is bundled with `NODE_ENV=production`
- **THEN** all assertion functions SHALL be eliminated by DCE, and the audit SHALL verify this by examining the production bundle for assertion-related strings

#### Scenario: Bundle size measured

- **WHEN** the audit measures the production bundle size
- **THEN** it SHALL document: total size, size without validation code, size of each layer, and compare against gl-matrix (~10KB min+gz) and three.js math module size

#### Scenario: Side effects correctly declared

- **WHEN** the audit verifies `moduleSideEffects: false` in the rollup config
- **THEN** it SHALL verify that no module has side effects that would break tree-shaking (global state initialization, prototype mutation, etc.), and document any exceptions (e.g., the `config` object in deterministic-kernels)

---

### Requirement: Memory layout and cache efficiency analyzed

The memory layout of core types SHALL be analyzed for cache efficiency:

1. **Structure of arrays vs array of structures**: Whether the current class-based approach (AoS) is cache-friendly for batch operations
2. **Float64Array backing**: Whether backing core types with typed arrays would improve memory layout
3. **SIMD potential**: Whether the data layout allows future SIMD optimization (when WebAssembly SIMD is standard)
4. **Comparison**: How do high-performance engines lay out math types? (Unity DOTS uses SoA, gl-matrix uses Float32Array)

#### Scenario: Current layout characterized

- **WHEN** the audit analyzes the memory layout of Vector2 `{ x: number, y: number }`
- **THEN** it SHALL document: object overhead in V8 (hidden class pointer, property storage), total memory per instance, and compare against Float64Array(2) and plain tuple `[number, number]`

#### Scenario: Batch operation cache behavior

- **WHEN** the audit analyzes iterating over 10000 Vector2 instances to compute magnitudes
- **THEN** it SHALL document the expected cache miss pattern for AoS layout vs SoA alternative (separate x[], y[] arrays), citing Mike Acton's "Data-Oriented Design" (CppCon 2014) and Unity DOTS documentation

#### Scenario: Typed array backing evaluated

- **WHEN** the audit evaluates Float64Array backing for core types
- **THEN** it SHALL document: property access cost (array[0] vs .x), compatibility with the \*Like interface pattern, TypeScript ergonomics impact, and gl-matrix's experience with Float32Array backing

---

### Requirement: Hot path patterns identified and documented

The audit SHALL identify all operations that are likely hot paths in a physics engine and verify
they have allocation-free variants:

**Critical hot paths** (called per entity per frame):

- Vector add/subtract/scale
- Vector magnitude/magnitudeSq
- Vector dot product
- Vector normalize
- Rotation apply to vector
- Matrix-vector multiplication
- Transform compose/apply
- Distance/distanceSq
- Angle computation (atan2)

#### Scenario: All critical operations have out variants

- **WHEN** the audit checks each critical hot path operation
- **THEN** each SHALL have a static method accepting `out?` parameter for zero-allocation usage, and the audit SHALL document any missing variants

#### Scenario: Hot path operations avoid branching

- **WHEN** the audit examines the implementation of hot path operations
- **THEN** they SHALL avoid unnecessary branches (if/else on validation, error handling) in the Unchecked variants, citing branch prediction cost and the principle of paying only for what you use

#### Scenario: Hot path chain identified

- **WHEN** the audit maps a typical physics tick (detect collision → resolve → integrate → transform)
- **THEN** it SHALL document which operations chain together and whether the out parameter pattern supports efficient chaining without intermediate allocations

---

### Requirement: Inlining potential evaluated

The audit SHALL evaluate whether critical functions are likely to be inlined by V8 TurboFan:

1. **Function size**: Small functions (< ~600 bytes bytecode) are eligible for inlining
2. **Polymorphism**: Monomorphic calls are more likely to be inlined
3. **Argument count**: Functions with fewer arguments are easier to inline
4. **Return type stability**: Functions that always return the same type

#### Scenario: Scalar functions are inlining candidates

- **WHEN** the audit evaluates scalar functions (lerp, clamp, nearEquals)
- **THEN** it SHALL assess whether their size and argument count make them likely V8 inline candidates, citing V8's inlining heuristics documentation

#### Scenario: Type guard functions are inlining-friendly

- **WHEN** the audit evaluates type guard functions (isVector2Like, etc.)
- **THEN** it SHALL verify they are small, branch-free, and return boolean consistently, making them ideal inline candidates for V8
