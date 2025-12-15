# Function: freezeRotation2()

> **freezeRotation2**(`rotation`): [`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Defined in: [src/core/rotation2.ts:106](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L106)

Permanently freezes a [Rotation2](../classes/Rotation2.md) instance so it can no longer be mutated.

## Parameters

### rotation

[`Rotation2`](../classes/Rotation2.md)

The Rotation2 object to freeze.

## Returns

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

The same instance, now typed as ReadonlyRotation2.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify `cos` or `sin` throws a TypeError.

## Example

```typescript
const QUARTER = freezeRotation2(Rotation2.fromAngle(Math.PI / 2));
QUARTER.cos = 1; // Throws in strict mode
```

## Since

0.9.0
