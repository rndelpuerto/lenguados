# Function: freezeInterval()

> **freezeInterval**(`interval`): [`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Defined in: [src/core/interval.ts:67](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/interval.ts#L67)

Permanently freezes an [Interval](../classes/Interval.md) instance so it can no longer be mutated.

## Parameters

### interval

[`Interval`](../classes/Interval.md)

The Interval object to freeze

## Returns

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

The same instance, now typed as ReadonlyInterval

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify `min` or `max` throws a TypeError.

## Example

```typescript
const UNIT = freezeInterval(new Interval(0, 1));
UNIT.min = 5; // Throws in strict mode
```

## Since

0.7.0
