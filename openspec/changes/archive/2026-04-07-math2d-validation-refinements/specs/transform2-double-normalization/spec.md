## ADDED Requirements

### Requirement: `Transform2` static methods SHALL use direct `rotation.cos`/`rotation.sin` assignment instead of `rotation.set()`

The following `Transform2` static/instance methods compute normalized `(cos, sin)` values manually, then assign them via `rotation.set(cos, sin)`. Since `Rotation2.set()` normalizes internally (computes magnitude, divides), this triggers a redundant `Math.sqrt` or `hypot` call on values already guaranteed to be unit-length.

**Affected methods**:

1. `Transform2.multiply` static (~line 569)
2. `Transform2.inverseUnchecked` static (~line 675)
3. `Transform2.fromComponents` static (~line 357)
4. `Transform2.premultiply` instance (~line 1992)

**Fix**: Replace `result.rotation.set(cos, sin)` with direct property assignment:

```typescript
result.rotation.cos = cos;
result.rotation.sin = sin;
```

This is safe because:

1. `cos`/`sin` are already unit-length by construction (computed from trigonometric functions or from composing existing unit rotations)
2. `Rotation2.cos` and `Rotation2.sin` are public mutable properties
3. The result object is freshly created or exclusively owned by the calling method

#### Scenario: Transform2.multiply result rotation is correct (no regression)

- **WHEN** `Transform2.multiply(a, b)` is called with valid transforms
- **THEN** the result rotation SHALL equal the composition of `a.rotation` and `b.rotation`
- **AND** the result rotation SHALL have unit magnitude (within EPSILON)

#### Scenario: Transform2.inverseUnchecked result rotation is correct (no regression)

- **WHEN** `Transform2.inverseUnchecked(t)` is called with a valid transform
- **THEN** `Transform2.multiply(t, Transform2.inverseUnchecked(t))` SHALL approximate the identity transform

#### Scenario: Transform2.fromComponents result rotation is correct (no regression)

- **WHEN** `Transform2.fromComponents(pos, rotation, scale)` is called
- **THEN** the result SHALL encode the given rotation without modification

#### Scenario: Transform2 round-trip via multiply + inverse (no regression)

- **WHEN** `t_inv = Transform2.inverseUnchecked(t)` and `Transform2.multiply(t, t_inv)` are computed
- **THEN** the composed transform SHALL approximate identity with magnitude difference < EPSILON
