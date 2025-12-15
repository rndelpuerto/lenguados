# Function: isPositiveInfinity()

> **isPositiveInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:78](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/guards.ts#L78)

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
isPositiveInfinity(Infinity);      // true
isPositiveInfinity(1 / 0);         // true
isPositiveInfinity(-Infinity);     // false
isPositiveInfinity(42);            // false
```

## Since

1.0.0
