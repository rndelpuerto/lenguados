# Function: fract()

> **fract**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:164](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/rounding.ts#L164)

Gets fractional part.

## Parameters

### value

`number`

Value to get fraction from

## Returns

`number`

Fractional part (always positive)

## Example

```typescript
fract(3.7); // 0.7
fract(3.2); // 0.2
fract(-3.7); // 0.3
fract(-3.2); // 0.8
fract(5); // 0
```

## Since

0.7.0
