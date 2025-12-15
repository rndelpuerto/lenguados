# Function: isFinite()

> **isFinite**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:38](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/guards.ts#L38)

Tests if value is finite (not NaN, ±Infinity).

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if finite number

## Example

```typescript
isFinite(42);            // true
isFinite(0);             // true
isFinite(NaN);           // false
isFinite(Infinity);      // false
isFinite(-Infinity);     // false
```

## Since

1.0.0
