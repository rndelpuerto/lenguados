# Function: isPositiveInfinity()

> **isPositiveInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:33](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/guards.ts#L33)

Tests if value is positive infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if positive infinity

## Example

```typescript
isPositiveInfinity(Infinity); // true
isPositiveInfinity(1 / 0); // true
isPositiveInfinity(-Infinity); // false
isPositiveInfinity(42); // false
```

## Since

0.7.0
