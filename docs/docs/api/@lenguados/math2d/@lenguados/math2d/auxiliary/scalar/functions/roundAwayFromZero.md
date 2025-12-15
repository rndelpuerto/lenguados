# Function: roundAwayFromZero()

> **roundAwayFromZero**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:336](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L336)

Rounds to nearest integer away from zero.

## Parameters

### value

`number`

Value to round

## Returns

`number`

Rounded value

## Example

```typescript
roundAwayFromZero(1.5);     // 2
roundAwayFromZero(-1.5);    // -2
roundAwayFromZero(1.4);     // 1
roundAwayFromZero(-1.4);    // -1
```

## Since

1.0.0
