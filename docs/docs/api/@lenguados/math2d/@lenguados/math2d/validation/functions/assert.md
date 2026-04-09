# Function: assert()

> **assert**(`condition`, `message?`): `void`

Defined in: [src/validation/assert.ts:376](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/validation/assert.ts#L376)

Asserts a generic boolean condition.

## Parameters

### condition

`boolean`

Boolean condition to validate

### message?

`string`

Error message if condition is false (optional)

## Returns

`void`

## Remarks

Base assertion for any custom validation logic.
No-op when assertions are disabled.

## Throws

If assertions enabled and condition is `false`

## Example

```typescript
assert(array.length > 0, 'Array must not be empty');
assert(index >= 0 && index < array.length, `Index ${index} out of bounds`);
```

## Since

0.7.0
