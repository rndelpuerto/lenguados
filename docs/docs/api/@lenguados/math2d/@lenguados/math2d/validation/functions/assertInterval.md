# Function: assertInterval()

> **assertInterval**(`min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:695](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L695)

Asserts that Interval components are finite and properly ordered.

## Parameters

### min

`number`

Minimum bound to validate

### max

`number`

Maximum bound to validate

### name?

`string`

Interval name for error messages (optional)

## Returns

`void`

## Remarks

Validates both components are finite AND min <= max.
No-op when assertions are disabled.

## Throws

If assertions enabled and any component is not finite or min > max

## Example

```typescript
function createInterval(min: number, max: number): Interval {
 assertInterval(min, max, 'bounds');
 return new Interval(min, max);
}
```

## Since

0.8.0
