# Function: assertPositive()

> **assertPositive**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:253](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L253)

Asserts that a value is strictly positive (> 0).

## Parameters

### value

`number`

Numeric value to validate.

### name?

`string`

Parameter name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and value ≤ 0.

## Remarks

Zero is not considered positive. Use `assertNonNegative` for ≥ 0.
No-op when assertions are disabled.

## Example

```typescript
function setRadius(r: number): void {
 assertPositive(r, 'radius');
 this.radius = r;
}
```

## Since

0.7.0
