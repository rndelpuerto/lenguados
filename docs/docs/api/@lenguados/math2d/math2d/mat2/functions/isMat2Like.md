# Function: isMat2Like()

> **isMat2Like**(`subject`): `subject is Readonly<Mat2Like>`

Defined in: [src/mat2.ts:80](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/mat2.ts#L80)

**Type guard** for a plain object that *looks* like a 2×2 matrix.

## Parameters

### subject

`unknown`

Unknown value.

## Returns

`subject is Readonly<Mat2Like>`

`true` if *subject* exposes numeric `m00, m01, m10, m11` members.

## Example

```ts
const maybe: unknown = { m00: 1, m01: 0, m10: 0, m11: 1 };
if (isMat2Like(maybe)) {
  // safely use maybe.m00, maybe.m11 ...
}
```
