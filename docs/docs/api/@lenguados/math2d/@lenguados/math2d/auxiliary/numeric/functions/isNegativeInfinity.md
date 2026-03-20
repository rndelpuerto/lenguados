# Function: isNegativeInfinity()

> **isNegativeInfinity**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:53](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/guards.ts#L53)

Tests if value is negative infinity.

## Parameters

### value

`number`

Value to test

## Returns

`boolean`

True if negative infinity

## Example

```typescript
isNegativeInfinity(-Infinity); // true
isNegativeInfinity(-1 / 0); // true
isNegativeInfinity(Infinity); // false
isNegativeInfinity(-42); // false
```

## Since

0.7.0
