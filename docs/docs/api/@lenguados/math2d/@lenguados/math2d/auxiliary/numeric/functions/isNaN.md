# Function: isNaN()

> **isNaN**(`value`): `boolean`

Defined in: [src/auxiliary/numeric/guards.ts:58](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/guards.ts#L58)

Tests if value is NaN.

## Parameters

### value

`number`

Value to test.

## Returns

`boolean`

True if NaN.

## Example

```typescript
isNaN(NaN); // true
isNaN(0 / 0); // true
isNaN(42); // false
isNaN(Infinity); // false
```

## Since

1.0.0
