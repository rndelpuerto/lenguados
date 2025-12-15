# Function: freezeMatrix3()

> **freezeMatrix3**(`matrix`): [`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Defined in: [src/core/matrix3.ts:90](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/matrix3.ts#L90)

Permanently freezes a [Matrix3](../classes/Matrix3.md) instance so it can no longer be mutated.

## Parameters

### matrix

[`Matrix3`](../classes/Matrix3.md)

The Matrix3 object to freeze.

## Returns

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

The same instance, now typed as ReadonlyMatrix3.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify properties throws a TypeError.

## Example

```typescript
const IDENTITY = freezeMatrix3(new Matrix3());
IDENTITY.m00 = 5; // Throws in strict mode
```

## Since

0.9.0
