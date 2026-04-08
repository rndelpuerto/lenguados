# Function: assertInterval()

> **assertInterval**(`min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:695](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L695)

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

0.7.0
