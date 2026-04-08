# Function: freezeMatrix3()

> **freezeMatrix3**(`matrix`): [`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Defined in: [src/core/matrix3.ts:92](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/matrix3.ts#L92)

Permanently freezes a [Matrix3](../classes/Matrix3.md) instance so it can no longer be mutated.

## Parameters

### matrix

[`Matrix3`](../classes/Matrix3.md)

The Matrix3 object to freeze

## Returns

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

The same instance, now typed as ReadonlyMatrix3

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify properties throws a TypeError.

## Example

```typescript
const IDENTITY = freezeMatrix3(new Matrix3());
IDENTITY.m00 = 5; // Throws in strict mode
```

## Since

0.7.0
