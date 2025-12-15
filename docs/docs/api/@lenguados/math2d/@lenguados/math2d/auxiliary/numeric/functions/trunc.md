# Function: trunc()

> **trunc**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:181](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/rounding.ts#L181)

Truncates to integer (towards zero).

## Parameters

### value

`number`

Value to truncate.

## Returns

`number`

Truncated integer.

## Example

```typescript
trunc(3.7); // 3
trunc(3.2); // 3
trunc(-3.7); // -3
trunc(-3.2); // -3
```

## Since

1.0.0
