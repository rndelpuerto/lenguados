# Function: isInfinity()

> **isInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:73](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/guards.ts#L73)

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
