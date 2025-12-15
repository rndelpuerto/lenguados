# Function: measureAsync()

> **measureAsync**\<`T`\>(`label`, `function_`): `Promise`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Defined in: [src/utils/performance.ts:74](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L74)

Measures an asynchronous function, returning its result and duration.

## Type Parameters

### T

`T`

## Parameters

### label

`string`

Identifier for the measurement

### function\_

() => `Promise`\<`T`\>

## Returns

`Promise`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Measurement metadata
