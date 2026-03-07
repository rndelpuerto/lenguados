# Function: safeLog()

> **safeLog**(`value`, `base`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:122](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L122)

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

0.7.0
