# Function: areAssertionsEnabled()

> **areAssertionsEnabled**(): `boolean`

Defined in: [src/validation/assert.ts:147](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/validation/assert.ts#L147)

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
