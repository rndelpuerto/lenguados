# Function: freezeTransform2()

> **freezeTransform2**(`transform`): [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:81](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/transform2.ts#L81)

Permanently freezes a [Transform2](../classes/Transform2.md) instance so it can no longer be mutated.

## Parameters

### transform

[`Transform2`](../classes/Transform2.md)

The Transform2 object to freeze

## Returns

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

The same instance, now typed as ReadonlyTransform2

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify properties throws a TypeError.
- Note: This also freezes the nested `position` and `scale` vectors.

## Example

```typescript
const IDENTITY = freezeTransform2(new Transform2());
IDENTITY.rotation = Math.PI; // Throws in strict mode
```

## Since

0.7.0
