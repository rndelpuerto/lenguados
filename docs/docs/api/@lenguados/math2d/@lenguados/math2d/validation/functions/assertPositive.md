# Function: assertPositive()

> **assertPositive**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:276](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L276)

Asserts that a value is strictly positive (> 0).

## Parameters

### value

`number`

Numeric value to validate

### name?

`string`

Parameter name for error messages (optional)

## Returns

`void`

## Remarks

Zero is not considered positive. Use `assertNonNegative` for ≥ 0.
No-op when assertions are disabled.

## Throws

If assertions enabled and value is ≤ 0 or NaN

## Example

```typescript
function setRadius(r: number): void {
 assertPositive(r, 'radius');
 this.radius = r;
}
```

## Since

0.7.0
