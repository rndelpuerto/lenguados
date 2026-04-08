# Function: assertVector2Like()

> **assertVector2Like**(`value`, `name?`): `asserts value is Vector2Like`

Defined in: [src/validation/assert.ts:798](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L798)

Asserts that an object has valid Vector2-like shape with finite components.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is Vector2Like`

## Remarks

Validates that object has `x` and `y` numeric properties that are finite.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isVector2Like()`.

## Throws

If assertions enabled and object is not Vector2-like or has invalid components

## Example

```typescript
function processVector(v: unknown): Vector2 {
 assertVector2Like(v, 'input');
 return new Vector2(v.x, v.y);
}
```

## Since

0.7.0
