# Function: fract()

> **fract**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:199](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/rounding.ts#L199)

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
fract(3.7);        // 0.7
fract(3.2);        // 0.2
fract(-3.7);       // 0.3
fract(-3.2);       // 0.8
fract(5);          // 0
```

## Since

1.0.0
