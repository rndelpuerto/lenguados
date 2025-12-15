# Function: safeLog()

> **safeLog**(`value`, `base`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:193](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/safety.ts#L193)

Safe logarithm (returns -Infinity for <= 0).

## Parameters

### value

`number`

Value to take logarithm of.

### base

`number` = `Math.E`

Logarithm base (default: Math.E for natural log).

## Returns

`number`

Logarithm or -Infinity for non-positive values.

## Example

```typescript
safeLog(Math.E); // 1
safeLog(10, 10); // 1
safeLog(100, 10); // 2
safeLog(0); // -Infinity
safeLog(-1); // -Infinity
```

## Since

1.0.0
