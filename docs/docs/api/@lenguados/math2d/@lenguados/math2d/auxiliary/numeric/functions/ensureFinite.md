# Function: ensureFinite()

> **ensureFinite**(`value`, `fallback`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:425](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L425)

Ensures finite value, replaces NaN/Infinity.

## Parameters

### value

`number`

Value to check.

### fallback

`number` = `0`

Replacement for non-finite values (default: 0).

## Returns

`number`

Finite value or fallback.

## Remarks

Use when you need to guarantee a finite result from calculations
that might produce NaN or Infinity.

## Example

```typescript
ensureFinite(42); // 42
ensureFinite(NaN); // 0
ensureFinite(Infinity); // 0
ensureFinite(-Infinity); // 0
ensureFinite(NaN, 1); // 1 (custom fallback)
```

## Since

1.0.0
