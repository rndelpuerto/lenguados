# Function: areAssertionsEnabled()

> **areAssertionsEnabled**(): `boolean`

Defined in: [src/validation/assert.ts:108](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L108)

Returns the current assertions state.

## Returns

`boolean`

`true` if assertions are enabled, `false` otherwise.

## Remarks

Reflects the global state set by [setAssertionsEnabled](setAssertionsEnabled.md).

## Example

```typescript
if (areAssertionsEnabled()) {
 console.log('Debug mode: assertions active');
}
```

## Since

0.1.0
