# Function: ensureFinite()

> **ensureFinite**(`value`, `fallback?`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:508](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/safety.ts#L508)

Ensures finite value, replaces NaN/Infinity.

## Parameters

### value

`number`

Value to check

### fallback?

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
