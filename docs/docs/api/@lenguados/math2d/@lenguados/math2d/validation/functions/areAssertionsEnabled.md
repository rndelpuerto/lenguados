# Function: areAssertionsEnabled()

> **areAssertionsEnabled**(): `boolean`

Defined in: [src/validation/assert.ts:128](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L128)

Returns the current assertions state.

## Returns

`boolean`

`true` if assertions are enabled, `false` otherwise.

## Remarks

In development: Returns the runtime state set by [setAssertionsEnabled](setAssertionsEnabled.md).
In production: Always returns `false` (assertions are compile-time eliminated).

## Example

```typescript
if (areAssertionsEnabled()) {
 console.log('Debug mode: assertions active');
}
```

## Since

0.7.0
