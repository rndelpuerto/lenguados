# Function: assert()

> **assert**(`condition`, `message?`): `void`

Defined in: [src/validation/assert.ts:317](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L317)

Asserts a generic boolean condition.

## Parameters

### condition

`boolean`

Boolean condition to validate.

### message?

`string`

Error message if condition is false (optional).

## Returns

`void`

## Throws

If assertions enabled and condition is `false`.

## Remarks

Base assertion for any custom validation logic.
No-op when assertions are disabled.

## Example

```typescript
assert(array.length > 0, 'Array must not be empty');
assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
```

## Since

0.1.0
