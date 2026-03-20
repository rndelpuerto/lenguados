# Function: freezeRotation2()

> **freezeRotation2**(`rotation`): [`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Defined in: [src/core/rotation2.ts:117](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/rotation2.ts#L117)

Permanently freezes a [Rotation2](../classes/Rotation2.md) instance so it can no longer be mutated.

## Parameters

### rotation

[`Rotation2`](../classes/Rotation2.md)

The Rotation2 object to freeze

## Returns

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

The same instance, now typed as ReadonlyRotation2Like

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify `cos` or `sin` throws a TypeError.

## Example

```typescript
const QUARTER = freezeRotation2(Rotation2.fromAngle(Math.PI / 2));
QUARTER.cos = 1; // Throws in strict mode
```

## Since

0.7.0
