# Function: isInfinity()

> **isInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:118](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/guards.ts#L118)

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
isInfinity(Infinity);      // true
isInfinity(-Infinity);     // true
isInfinity(42);            // false
isInfinity(NaN);           // false
```

## Since

1.0.0
