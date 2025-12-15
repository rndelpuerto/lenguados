# Function: freezeVector2()

> **freezeVector2**(`vector`): [`ReadonlyVector2`](../type-aliases/ReadonlyVector2.md)

Defined in: [src/core/vector2.ts:89](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L89)

Permanently freezes a [Vector2](../classes/Vector2.md) instance so it can no longer be mutated.

## Parameters

### vector

[`Vector2`](../classes/Vector2.md)

The Vector2 object to freeze.

## Returns

[`ReadonlyVector2`](../type-aliases/ReadonlyVector2.md)

The same instance, now typed as ReadonlyVector2.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify `x` or `y` throws a TypeError.

## Example

```typescript
const ORIGIN = freezeVector2(new Vector2(0, 0));
ORIGIN.x = 5; // Throws in strict mode
```

## Since

0.8.0
