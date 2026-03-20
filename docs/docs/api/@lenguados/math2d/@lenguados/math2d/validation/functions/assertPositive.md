# Function: assertPositive()

> **assertPositive**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:267](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L267)

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

If assertions enabled and value ≤ 0

## Example

```typescript
function setRadius(r: number): void {
 assertPositive(r, 'radius');
 this.radius = r;
}
```

## Since

0.7.0
