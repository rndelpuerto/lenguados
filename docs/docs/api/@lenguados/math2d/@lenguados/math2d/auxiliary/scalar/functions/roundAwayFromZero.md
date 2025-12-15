# Function: roundAwayFromZero()

> **roundAwayFromZero**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:468](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L468)

Rounds to nearest integer away from zero.

## Parameters

### value

`number`

Value to round.

## Returns

`number`

Rounded value.

## Example

```typescript
roundAwayFromZero(1.5); // 2
roundAwayFromZero(-1.5); // -2
roundAwayFromZero(1.4); // 1
roundAwayFromZero(-1.4); // -1
```

## Since

1.0.0
