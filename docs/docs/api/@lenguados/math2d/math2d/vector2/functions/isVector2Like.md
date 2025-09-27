# Function: isVector2Like()

> **isVector2Like**(`subject`): `subject is ReadonlyVector2Like`

Defined in: [src/vector2.ts:76](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L76)

Type guard for a plain object that *looks like* a 2‑D vector.

## Parameters

### subject

`unknown`

Unknown value to test.

## Returns

`subject is ReadonlyVector2Like`

`true` if `subject` is an object with numeric `x` and `y` properties; otherwise `false`.

## Example

```ts
if (isVector2Like(maybe)) {
  // `maybe` is narrowed to `{ readonly x:number, readonly y:number }`
  console.log(maybe.x + maybe.y);
}
```
