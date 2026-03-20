# Function: isPositiveInfinity()

> **isPositiveInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:33](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/guards.ts#L33)

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
