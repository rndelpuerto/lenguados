# Function: isInfinity()

> **isInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:73](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/guards.ts#L73)

Tests if value is any infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if positive or negative infinity

## Example

```typescript
isInfinity(Infinity); // true
isInfinity(-Infinity); // true
isInfinity(42); // false
isInfinity(NaN); // false
```

## Since

0.7.0
