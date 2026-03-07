# Performance Benchmarks & Validation (Tasks 14.1-14.8)

> **Environment:** Node.js v22.14.0, macOS Darwin 24.4.0, Apple Silicon
> **Build:** ESM development bundle, `@lenguados/math2d`
> **Methodology:** 1M iterations per benchmark (100K for N-loop tests), 10K warmup

---

## 14.1 fdlibm Kernels vs Native Math

| Function | fdlibm (ns/op) | Native (ns/op) | Overhead Factor |
| -------- | -------------- | -------------- | --------------- |
| sin      | 44             | 26             | **1.7-2.0x**    |
| cos      | 58             | 24             | **2.2-2.5x**    |
| atan2    | 33             | 26             | **1.3x**        |
| sqrt     | 57             | 10             | **5.6-6.4x**    |
| hypot    | 66             | 35             | **1.9x**        |

### Key Findings

- **sqrt is 5.6-6.4x slower than Math.sqrt.** This is the strongest quantitative evidence supporting the Phase 2 recommendation to remove custom sqrt from deterministic/. Math.sqrt is IEEE 754 required (correctly rounded to 0.5 ULP). The custom implementation is both slower AND less accurate.

- **sin/cos overhead is 1.7-2.5x**, which is far better than the "~4x" estimated in internal documentation (core_principles.md). The fdlibm polynomial kernels are reasonably competitive, though not free.

- **atan2 overhead is only 1.3x**, making it the most cost-effective deterministic replacement. The fdlibm atan2 kernel is nearly native speed.

- **hypot has 1.9x overhead.** Since hypot uses custom sqrt internally (via the fdlibm kernel), switching to Math.sqrt would reduce this further. However, Math.hypot itself has cross-platform variation, so the custom hypot (with Math.sqrt) should be kept.

### Recommendation

Remove `sqrt` from deterministic kernels. Use `Math.sqrt` directly. Keep `hypot` but change its internal implementation to use `Math.sqrt` instead of the custom polynomial sqrt.

---

## 14.2 out Parameter vs Allocation

| Method                               | ns/op | Speedup        |
| ------------------------------------ | ----- | -------------- |
| Vector2.add(a, b) [alloc new object] | 80    | baseline       |
| Vector2.add(a, b, out) [reuse]       | 6     | **13x faster** |
| a.clone().add(b) [instance chain]    | 86    | ~same as alloc |

### Key Findings

- **The `out` parameter pattern provides a massive 13x speedup** in tight loops. This validates the library's zero-allocation design as critical for hot paths.

- Instance chaining (`clone().add()`) has the same cost as static allocation because `clone()` creates a new object. Instance methods are ergonomic for non-hot-path code but should not be used in physics step loops.

- The ~80ns allocation cost is dominated by GC pressure, not the arithmetic itself (which is ~6ns).

---

## 14.3 \*CS Variants: rotateCS vs rotate

| Method                     | ns/op | Notes                   |
| -------------------------- | ----- | ----------------------- |
| Vector2.rotate(angle)      | 90    | Calls sinCos internally |
| Vector2.rotateCS(cos, sin) | 6     | Pre-computed cos/sin    |
| **Speedup**                |       | **~15x**                |

### Breakeven Analysis (N rotations with same angle)

| N   | rotate total | rotateCS total | Ratio              |
| --- | ------------ | -------------- | ------------------ |
| 1   | 93ns         | 95ns           | 0.99x (no benefit) |
| 5   | 493ns        | 170ns          | 2.9x               |
| 10  | 960ns        | 264ns          | 3.6x               |
| 50  | 4623ns       | 1122ns         | 4.1x               |
| 100 | 9229ns       | 1815ns         | 5.1x               |

### Key Finding

- **Breakeven point is N=2.** At N=1, rotateCS is marginally slower (the sinCos call overhead). At N=2+, rotateCS wins. For any loop over vertices/particles with the same rotation angle, \*CS variants are mandatory.

- The internal docs claim "6x faster" — our measurement shows **15x faster** for single operations. The actual improvement is even larger than documented.

---

## 14.4 Inter-Type Facade Overhead

| Method                      | ns/op | Notes                  |
| --------------------------- | ----- | ---------------------- |
| Transform2.toMatrix3()      | 527   | Library method         |
| Direct Matrix3.fromValues() | 417   | Manual TRS composition |
| **Overhead**                |       | **1.3x**               |

### Key Finding

- The Transform2.toMatrix3() facade has ~26% overhead vs direct matrix construction. This is acceptable — the method does validation and proper deep copying. Not a hot-path concern.

---

## 14.5 Instance vs Static Dispatch

| Method                          | ns/op | Notes                                   |
| ------------------------------- | ----- | --------------------------------------- |
| Vector2.add(a, b, out) [static] | 6     | Pre-allocated out                       |
| v1.clone().add(v2) [instance]   | 81    | Allocates via clone                     |
| **Ratio**                       |       | **14x** (dominated by clone allocation) |

| Method                      | ns/op | Notes               |
| --------------------------- | ----- | ------------------- |
| Complex.multiply(a, b, out) | 7     | Pre-allocated out   |
| c1.clone().multiply(c2)     | 81    | Allocates via clone |
| **Ratio**                   |       | **11x**             |

### Key Finding

- The dispatch overhead of instance vs static is negligible. The 11-14x difference is entirely due to **allocation** (clone), not method dispatch. When both use `out` parameters, static and instance performance would be comparable.

- This confirms the library's guidance: use static+out for hot paths, use instance chaining for ergonomic non-critical code.

---

## 14.6 Tree-Shaking Verification

| Metric                        | Value                                      |
| ----------------------------- | ------------------------------------------ |
| Development bundle size       | 525 KB                                     |
| Production bundle size        | 122 KB                                     |
| **Size reduction**            | **76.8%**                                  |
| Assertion refs in dev         | 34                                         |
| Assertion refs in prod        | 1 (exports only)                           |
| `sideEffects` in package.json | `false`                                    |
| DCE mechanism                 | `process.env.NODE_ENV` (industry standard) |

### Key Finding

- Production build is **4.3x smaller** than development build. Assertions are effectively eliminated.
- The `sideEffects: false` flag enables bundlers (Vite, Webpack, Rollup) to tree-shake unused exports.
- The single remaining assertion reference in production is just the export declaration (dead code that bundlers will eliminate when not imported).

---

## 14.7 Hidden Class Stability

| Type       | Constructor                 | fromValues/fromAngle        | Property Order Match |
| ---------- | --------------------------- | --------------------------- | -------------------- |
| Vector2    | [x, y]                      | [x, y]                      | STABLE               |
| Complex    | [real, imag]                | [real, imag]                | STABLE               |
| Rotation2  | [cos, sin]                  | [cos, sin]                  | STABLE               |
| Interval   | [min, max]                  | [min, max]                  | STABLE               |
| Matrix2    | [m00, m01, m10, m11]        | [m00, m01, m10, m11]        | STABLE               |
| Matrix3    | [m00..m22] (9 props)        | [m00..m22] (9 props)        | STABLE               |
| Transform2 | [position, rotation, scale] | [position, rotation, scale] | STABLE               |

### Key Finding

- **All 7 core types have STABLE hidden classes.** Property initialization order is identical across all construction paths (constructor, fromValues, fromAngle, etc.).
- This means V8 will create a single hidden class per type, enabling optimal inline caching for all property accesses and method calls.
- The library correctly avoids the "polymorphic" deoptimization that occurs when objects of the "same type" have different property layouts.

---

## 14.8 Memory Layout

### Float Storage per Type

| Type       | Floats            | Bytes (data only) | Estimated total (with V8 overhead) |
| ---------- | ----------------- | ----------------- | ---------------------------------- |
| Vector2    | 2                 | 16                | ~80 bytes                          |
| Complex    | 2                 | 16                | ~80 bytes                          |
| Rotation2  | 2                 | 16                | ~80 bytes                          |
| Interval   | 2                 | 16                | ~80 bytes                          |
| Matrix2    | 4                 | 32                | ~96 bytes                          |
| Matrix3    | 9                 | 72                | ~136 bytes                         |
| Transform2 | 6 (via 3 objects) | 48                | ~304 bytes                         |

### Object vs TypedArray Allocation

| Allocation          | ns/op    | Notes                            |
| ------------------- | -------- | -------------------------------- |
| new Vector2()       | 80       | JS object with named properties  |
| new Float64Array(2) | 32       | Typed array                      |
| **Ratio**           | **2.5x** | Object allocation is 2.5x slower |

### Key Finding

- Object allocation is 2.5x slower than Float64Array allocation. However, this cost is only paid at creation time. Property access on named objects is equally fast (or faster due to V8 hidden class optimization) compared to indexed typed array access.

- For the library's use case (objects created once, accessed millions of times), the named-property design is optimal. gl-matrix's Float32Array approach trades ergonomics for faster allocation, which matters less than access speed.

- Transform2 at ~304 bytes is the heaviest type due to 3 nested objects. This is the cost of the decomposed TRS representation. For scenes with >10K transforms, a Structure-of-Arrays (SoA) layout should be considered (but this is outside math2d's scope).

---

## Summary Table

| Benchmark          | Key Result                               | Design Validation                       |
| ------------------ | ---------------------------------------- | --------------------------------------- |
| fdlibm vs native   | sin/cos: 2x, sqrt: 6x, atan2: 1.3x       | Remove custom sqrt, keep others         |
| out parameter      | 13x faster than allocation               | Zero-allocation pattern is critical     |
| \*CS variants      | 15x faster (breakeven at N=2)            | \*CS pattern justified for any loop     |
| Inter-type facades | 1.3x overhead                            | Acceptable                              |
| Instance vs static | 14x (due to clone, not dispatch)         | Hot paths must use static+out           |
| Tree-shaking       | 76.8% reduction (525KB→122KB)            | DCE works correctly                     |
| Hidden classes     | 7/7 STABLE                               | No deoptimization risk                  |
| Memory layout      | Object 2.5x slower alloc than TypedArray | Tradeoff is correct for access patterns |
