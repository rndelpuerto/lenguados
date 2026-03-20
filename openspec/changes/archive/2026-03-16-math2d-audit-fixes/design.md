## Context

An exhaustive audit verified @lenguados/math2d across 12 dimensions. The library scored A overall, with 1 confirmed bug, 3 API inconsistencies, 1 performance opportunity, and test coverage gaps in Safe/Unchecked triality variants. All fixes target the core/ layer only and are isolated per-method changes.

Current baseline: 3225/3225 tests pass, 0 ESLint violations.

## Goals / Non-Goals

**Goals:**

- Fix the Complex.slerp() instance bug (zero-magnitude guard)
- Align API consistency (Rotation2 doc, Matrix3 static getters, Complex.pow validation)
- Eliminate unnecessary allocation in Transform2.multiply() hot path
- Close test coverage gaps for triality variants and predicates

**Non-Goals:**

- Refactoring class structure or member ordering
- Adding new mathematical operations beyond the 3 Matrix3 static getters
- Changing deterministic kernels or auxiliary layer
- Modifying validation/assertion layer
- Changing any existing public method signatures

## Decisions

### D1. Complex.slerp() instance — mirror static guard

Add the same `isNearZero(mag1) || isNearZero(mag2)` check from the static version (L694-700) to the instance version (L2207-2218). On guard trigger, delegate to `this.lerp(other, t)`.

**Why this approach:** Exact parity with static version. The fallback to component-wise lerp is the mathematically correct degradation for zero-magnitude complex numbers (avoids undefined atan2(0,0)).

### D2. Rotation2 constructor — JSDoc warning only

Add `@remarks` block warning that the constructor does NOT normalize the (cos, sin) pair, unlike `set()` which does. Suggest `fromAngle()` or explicit `normalize()` for untrusted inputs.

**Why not change behavior:** The non-normalizing constructor is deliberate (Planck.js alignment, performance for internal construction). Changing it would break the established invariant that constructors are low-overhead.

### D3. Matrix3 static getters — follow instance implementations

Add three static methods:

- `Matrix3.getRotation(matrix: ReadonlyMatrix3Like): number`
- `Matrix3.getScale(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2`
- `Matrix3.getTranslation(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2`

Implementation: Extract the logic from the instance methods (L2683-2722). `getScale` and `getTranslation` use the `out?` pattern. `getRotation` returns a scalar (angle in radians), no out parameter needed.

**Why not delegate instance→static:** Instance methods are already concise. Duplicating ~3-5 lines per method is cleaner than adding indirection for such simple operations.

### D4. Complex.pow() instance — add explicit validation

Add `if (mag === 0 && exponent < 0)` check before computing, matching the static version's `throw new RangeError('Complex.pow: cannot raise zero to negative exponent')`.

**Why:** Currently the instance path allows `pow(0, -n)` to silently produce `(Infinity, NaN)` instead of the explicit error the static version provides. Users expect consistent error contracts.

### D5. Transform2.multiply() — inline rotation computation

Replace the temporary `Rotation2.multiply()` call with direct cos/sin computation:

```typescript
const newCos = this.rotation.cos * other.rotation.cos - this.rotation.sin * other.rotation.sin;
const newSin = this.rotation.sin * other.rotation.cos + this.rotation.cos * other.rotation.sin;
this.rotation.cos = newCos;
this.rotation.sin = newSin;
```

**Why bit-identical:** The formula is identical to what `Rotation2.multiply()` computes internally. The only change is eliminating the intermediate Rotation2 object allocation.

**Alternative considered:** Delegating to a `Rotation2.multiplyInto(a, b, target)` method. Rejected because it adds API surface for a single caller, and the inline approach is simpler.

### D6. Test strategy — one test file per source file, append to existing

All new tests go into existing test files (`test/core/matrix2.node.spec.ts`, etc.) in new `describe` blocks. Follow existing patterns for assertions and tolerances.

## Risks / Trade-offs

- **[D3 API addition]** Adding 3 new static methods is a minor API surface increase. → Mitigated: these are trivially simple getters, additive and non-breaking.
- **[D5 bit-identity]** Inlining rotation math must produce identical results. → Mitigated: verify by running full test suite; the formula is mathematically identical.
- **[D5 bypasses set()]** Direct assignment to `this.rotation.cos/sin` bypasses `set()`'s normalization. → Acceptable: the inputs are already-normalized rotation pairs, so re-normalization is unnecessary and was never performed in the current code path either (Rotation2.multiply returns already-computed cos/sin).
