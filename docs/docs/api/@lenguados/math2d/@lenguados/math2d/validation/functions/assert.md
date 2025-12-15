# Function: assert()

> **assert**(`condition`, `message?`): `void`

Defined in: [src/validation/assert.ts:208](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L208)

Asserts a generic condition.

## Parameters

### condition

`boolean`

Condition to check

### message?

`string`

Error message if condition fails

## Returns

`void`

## Throws

If assertions enabled and condition is false

## Example

```typescript
assert(array.length > 0, 'Array must not be empty');
assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
```
