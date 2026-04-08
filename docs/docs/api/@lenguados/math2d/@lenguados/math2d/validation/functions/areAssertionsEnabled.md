# Function: areAssertionsEnabled()

> **areAssertionsEnabled**(): `boolean`

Defined in: [src/validation/assert.ts:147](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L147)

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
