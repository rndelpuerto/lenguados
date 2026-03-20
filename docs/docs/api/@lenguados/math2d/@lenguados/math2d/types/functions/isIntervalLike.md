# Function: isIntervalLike()

> **isIntervalLike**(`value`): `value is ReadonlyIntervalLike`

Defined in: [src/types/index.ts:390](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/types/index.ts#L390)

Type guard to check if value has interval properties (IntervalLike).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyIntervalLike`

True if value conforms to ReadonlyIntervalLike

## Example

```typescript
const interval = { min: 0, max: 10 };
if (isIntervalLike(interval)) {
 console.log(interval.min, interval.max); // TypeScript knows min, max are numbers
}
```

## Since

0.7.0
