# Function: isNegativeInfinity()

> **isNegativeInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:53](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/guards.ts#L53)

Tests if value is negative infinity.

## Parameters

### value

`number`

Value to test.

## Returns

`boolean`

True if negative infinity.

## Example

```typescript
isNegativeInfinity(-Infinity); // true
isNegativeInfinity(-1 / 0); // true
isNegativeInfinity(Infinity); // false
isNegativeInfinity(-42); // false
```

## Since

0.7.0
