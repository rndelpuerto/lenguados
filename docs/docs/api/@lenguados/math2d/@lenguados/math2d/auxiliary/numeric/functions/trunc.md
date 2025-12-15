# Function: trunc()

> **trunc**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:178](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/rounding.ts#L178)

Truncates to integer (towards zero).

## Parameters

### value

`number`

Value to truncate

## Returns

`number`

Truncated integer

## Example

```typescript
trunc(3.7);        // 3
trunc(3.2);        // 3
trunc(-3.7);       // -3
trunc(-3.2);       // -3
```

## Since

1.0.0
