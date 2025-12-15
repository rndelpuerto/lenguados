# Function: freezeMatrix3()

> **freezeMatrix3**(`matrix`): [`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Defined in: [src/core/matrix3.ts:93](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/matrix3.ts#L93)

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
