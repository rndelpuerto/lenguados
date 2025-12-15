# Function: assertVector2Like()

> **assertVector2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:546](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L546)

Asserts that an object has valid Vector2-like shape with finite components.

## Parameters

### value

`unknown`

Object to validate.

### name?

`string`

Object name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and object is not Vector2-like or has invalid components.

## Remarks

Validates that object has `x` and `y` numeric properties that are finite.
No-op when assertions are disabled.

## Example

```typescript
function processVector(v: unknown): Vector2 {
 assertVector2Like(v, 'input');
 return new Vector2(v.x, v.y);
}
```

## Since

0.14.0
