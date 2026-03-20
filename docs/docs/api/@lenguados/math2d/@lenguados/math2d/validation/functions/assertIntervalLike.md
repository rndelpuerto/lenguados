# Function: assertIntervalLike()

> **assertIntervalLike**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:921](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L921)

Asserts that an object has valid Interval-like shape with finite bounds.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`void`

## Remarks

Validates that object has `min` and `max` numeric properties that are finite.
Also validates that min ≤ max.
No-op when assertions are disabled.

## Throws

If assertions enabled and object is not Interval-like or has invalid bounds

## Example

```typescript
function processInterval(i: unknown): Interval {
 assertIntervalLike(i, 'range');
 return new Interval(i.min, i.max);
}
```

## Since

0.7.0
