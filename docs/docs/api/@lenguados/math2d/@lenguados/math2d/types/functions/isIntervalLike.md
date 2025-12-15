# Function: isIntervalLike()

> **isIntervalLike**(`value`): `value is ReadonlyIntervalLike`

Defined in: [src/types/index.ts:408](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/types/index.ts#L408)

Type guard to check if value has interval properties (IntervalLike).

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is ReadonlyIntervalLike`

True if value conforms to ReadonlyIntervalLike.

## Example

```typescript
const interval = { min: 0, max: 10 };
if (isIntervalLike(interval)) {
 console.log(interval.min, interval.max); // TypeScript knows min, max are numbers
}
```

## Since

0.1.0
