# Function: assertTransform2Like()

> **assertTransform2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:961](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L961)

Asserts that an object has valid Transform2-like shape.

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

Validates that object has `position` (Vector2-like), `rotation` (Rotation2-like), and `scale` (Vector2-like).
No-op when assertions are disabled.

## Throws

If assertions enabled and object is not Transform2-like

## Example

```typescript
function processTransform(t: unknown): void {
 assertTransform2Like(t, 'input');
 // t is now validated as Transform2Like with finite components
}
```

## Since

0.7.0
