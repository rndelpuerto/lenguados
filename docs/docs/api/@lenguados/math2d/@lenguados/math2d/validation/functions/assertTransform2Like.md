# Function: assertTransform2Like()

> **assertTransform2Like**(`value`, `name?`): `asserts value is Transform2Like`

Defined in: [src/validation/assert.ts:1024](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L1024)

Asserts that an object has valid Transform2-like shape.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is Transform2Like`

## Remarks

Validates that object has `position` (Vector2-like), `rotation` (Rotation2-like), and `scale` (Vector2-like).
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isTransform2Like()`.

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
