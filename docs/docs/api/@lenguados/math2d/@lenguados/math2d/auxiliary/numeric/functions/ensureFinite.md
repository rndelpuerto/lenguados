# Function: ensureFinite()

> **ensureFinite**(`value`, `fallback`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:417](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L417)

Ensures finite value, replaces NaN/Infinity.

## Parameters

### value

`number`

Value to check

### fallback

`number` = `0`

Replacement for non-finite values (default: 0)

## Returns

`number`

Finite value or fallback

## Remarks

Use when you need to guarantee a finite result from calculations
that might produce NaN or Infinity.

## Example

```typescript
ensureFinite(42);              // 42
ensureFinite(NaN);             // 0
ensureFinite(Infinity);        // 0
ensureFinite(-Infinity);       // 0
ensureFinite(NaN, 1);          // 1 (custom fallback)
```

## Since

1.0.0
