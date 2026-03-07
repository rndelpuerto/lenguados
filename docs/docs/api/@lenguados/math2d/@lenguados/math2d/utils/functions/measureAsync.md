# Function: measureAsync()

> **measureAsync**\<`T`\>(`label`, `function_`): `Promise`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Defined in: [src/utils/performance.ts:118](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/performance.ts#L118)

Measures an asynchronous function, returning its result and duration.

## Type Parameters

### T

`T`

## Parameters

### label

`string`

Identifier for the measurement.

### function\_

() => `Promise`\<`T`\>

Async function to execute.

## Returns

`Promise`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Measurement metadata.

## Example

```typescript
const result = await measureAsync('load', async () => 42);
console.log(result.duration);
```

## Since

0.7.0
