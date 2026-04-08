# Function: isPositiveInfinity()

> **isPositiveInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:33](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/guards.ts#L33)

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
