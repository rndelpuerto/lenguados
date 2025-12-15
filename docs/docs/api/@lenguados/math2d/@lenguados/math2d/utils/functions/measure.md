# Function: measure()

> **measure**\<`T`\>(`label`, `function_`): [`Measurement`](../interfaces/Measurement.md)\<`T`\>

Defined in: [src/utils/performance.ts:61](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L61)

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

## Returns

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement metadata
