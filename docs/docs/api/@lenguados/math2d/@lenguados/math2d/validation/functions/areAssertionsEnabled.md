# Function: areAssertionsEnabled()

> **areAssertionsEnabled**(): `boolean`

Defined in: [src/validation/assert.ts:138](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L138)

Returns the current assertions state.

## Returns

`boolean`

`true` if assertions are enabled, `false` otherwise

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
