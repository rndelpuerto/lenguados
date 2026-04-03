# Function: measure()

> **measure**\<`T`\>(`label`, `function_`): [`Measurement`](../interfaces/Measurement.md)\<`T`\>

Defined in: [src/utils/performance.ts:95](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/performance.ts#L95)

Measures a synchronous function, returning its result and duration.

## Type Parameters

### T

`T`

## Parameters

### label

`string`

Identifier for the measurement

### function\_

() => `T`

Function to execute

## Returns

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement metadata

## Example

```typescript
const result = measure('tick', () => 42);
console.log(result.duration);
```

## Since

0.7.0
