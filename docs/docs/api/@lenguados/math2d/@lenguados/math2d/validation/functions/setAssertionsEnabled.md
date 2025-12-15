# Function: setAssertionsEnabled()

> **setAssertionsEnabled**(`enabled`): `void`

Defined in: [src/validation/assert.ts:86](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L86)

Enables or disables assertions globally.

## Parameters

### enabled

`boolean`

`true` to enable assertions, `false` to disable.

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

## Since

0.1.0
