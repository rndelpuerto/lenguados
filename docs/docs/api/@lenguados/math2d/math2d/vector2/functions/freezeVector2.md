# Function: freezeVector2()

> **freezeVector2**(`vector`): `Readonly`

Defined in: [src/vector2.ts:58](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L58)

Permanently freezes a [Vector2](../classes/Vector2.md) instance so it can no longer be mutated.

## Parameters

### vector

[`Vector2`](../classes/Vector2.md)

The [Vector2](../classes/Vector2.md) object to freeze.

## Returns

`Readonly`

The *same* instance, now typed as ReadonlyVector2 (Readonly\<[Vector2](../classes/Vector2.md)\>),
         after being frozen with Object.freeze.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In *strict mode* any subsequent attempt to modify `x` or `y` throws a
  `TypeError`. In non-strict mode the write is silently ignored.
- Use this helper to create **truly immutable static constants** such as
  Vector2.ZERO\_VECTOR, ensuring they cannot be altered at runtime.

## Example

```ts
const ZERO_VECTOR = freezeVector2(new Vector2(0, 0));

// Will throw in strict mode:
ZERO_VECTOR.x = 5;
```
