# Function: assertIntervalLike()

> **assertIntervalLike**(`value`, `name?`): `asserts value is IntervalLike`

Defined in: [src/validation/assert.ts:983](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/validation/assert.ts#L983)

Asserts that an object has valid Interval-like shape with finite bounds.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is IntervalLike`

## Remarks

Validates that object has `min` and `max` numeric properties that are finite.
Also validates that min ≤ max.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isIntervalLike()`.

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
