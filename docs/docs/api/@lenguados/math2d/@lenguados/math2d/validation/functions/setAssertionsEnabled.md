# Function: setAssertionsEnabled()

> **setAssertionsEnabled**(`enabled`): `void`

Defined in: [src/validation/assert.ts:105](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L105)

Enables or disables assertions globally at runtime.

## Parameters

### enabled

`boolean`

`true` to enable assertions, `false` to disable.

## Returns

`void`

## Remarks

**Development only**: This function only has effect when `process.env.NODE_ENV !== 'production'`
(development build). In production builds, assertions are
eliminated at compile-time via DCE (Dead Code Elimination).

The `safe*` functions in `auxiliary/numeric/safety.ts` remain active
regardless of this setting.

## Example

```typescript
// Temporarily disable assertions for performance testing
setAssertionsEnabled(false);

// Re-enable for debugging
setAssertionsEnabled(true);
```

## Since

0.7.0
