# Function: isNegativeInfinity()

> **isNegativeInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:98](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/guards.ts#L98)

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

1.0.0
