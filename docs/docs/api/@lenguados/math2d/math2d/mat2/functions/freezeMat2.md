# Function: freezeMat2()

> **freezeMat2**(`matrix`): `Readonly`

Defined in: [src/mat2.ts:62](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L62)

Permanently freezes a [Mat2](../classes/Mat2.md) instance so it can no longer be mutated.

## Parameters

### matrix

[`Mat2`](../classes/Mat2.md)

The [Mat2](../classes/Mat2.md) object to freeze.

## Returns

`Readonly`

The *same* instance, now typed as [ReadonlyMat2](../type-aliases/ReadonlyMat2.md),
         after being frozen with Object.freeze.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In *strict mode* any subsequent attempt to modify fields throws a `TypeError`.
  In non‑strict mode the write is silently ignored.
- Use this helper to create **truly immutable static constants** such as
  [Mat2.IDENTITY\_MATRIX](../classes/Mat2.md#identity_matrix), ensuring they cannot be altered at runtime.

## Example

```ts
const I = freezeMat2(new Mat2()); // identity by default
// Will throw in strict mode:
I.m00 = 2;
```
