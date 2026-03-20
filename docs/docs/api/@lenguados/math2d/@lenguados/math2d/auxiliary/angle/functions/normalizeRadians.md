# Function: normalizeRadians()

> **normalizeRadians**(`radians`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:34](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/normalization.ts#L34)

Normalizes an angle to [-PI, PI) range.
Standard signed angle representation.

## Parameters

### radians

`number`

Angle in radians

## Returns

`number`

Normalized angle in [-PI, PI)

## Remarks

For very large angles (>1e6 radians), floating-point precision loss in
the modulo operation may produce results that deviate from the
mathematically correct normalized value.

## Example

```typescript
normalizeRadians(0); // 0
normalizeRadians(Math.PI); // -Math.PI (range is [-PI, PI))
normalizeRadians(-Math.PI); // -Math.PI
normalizeRadians(3 * Math.PI); // -Math.PI
normalizeRadians(2 * Math.PI); // 0
```

## Since

0.7.0
