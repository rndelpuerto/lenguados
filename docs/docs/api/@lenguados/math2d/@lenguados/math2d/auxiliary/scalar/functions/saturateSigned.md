# Function: saturateSigned()

> **saturateSigned**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:94](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L94)

Saturates value to [-1, 1] range.
Useful for normalized directions.

## Parameters

### value

`number`

Value to saturate

## Returns

`number`

Saturated value in [-1, 1]

## Example

```typescript
saturateSigned(-2); // -1
saturateSigned(0.5); // 0.5
saturateSigned(2); // 1
```

## Since

0.7.0
