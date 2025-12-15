# Function: setAssertionsEnabled()

> **setAssertionsEnabled**(`enabled`): `void`

Defined in: [src/validation/assert.ts:70](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L70)

Enables or disables assertions globally.

## Parameters

### enabled

`boolean`

`true` to enable, `false` to disable

## Returns

`void`

## Remarks

When disabled, all assertion functions become no-ops with zero overhead.
The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
regardless of this setting.

## Example

```typescript
// Disable in production build
setAssertionsEnabled(false);

// Enable for debugging
setAssertionsEnabled(true);
```
