# Function: ensureFinite()

> **ensureFinite**(`value`, `fallback`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:465](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L465)

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

If the fallback itself is non-finite, it is silently replaced with 0.

## Example

```typescript
ensureFinite(42); // 42
ensureFinite(NaN); // 0
ensureFinite(Infinity); // 0
ensureFinite(-Infinity); // 0
ensureFinite(NaN, 1); // 1 (custom fallback)
```

## Since

0.7.0
