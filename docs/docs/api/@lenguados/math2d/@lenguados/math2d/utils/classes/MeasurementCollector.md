# Class: MeasurementCollector\<T\>

Defined in: [src/utils/performance.ts:186](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L186)

Convenience wrapper around [recordMeasurement](../functions/recordMeasurement.md) and [summarizeMeasurements](../functions/summarizeMeasurements.md).

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new MeasurementCollector**\<`T`\>(): `MeasurementCollector`\<`T`\>

#### Returns

`MeasurementCollector`\<`T`\>

## Accessors

### entries

#### Get Signature

> **get** **entries**(): `ReadonlyMap`\<`string`, readonly [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Defined in: [src/utils/performance.ts:218](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L218)

Returns a snapshot of the underlying measurements map.

##### Returns

`ReadonlyMap`\<`string`, readonly [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Read-only view of recorded measurements

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/utils/performance.ts:210](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L210)

Clears all recorded measurements.

#### Returns

`void`

***

### formatSummaries()

> **formatSummaries**(): `string`[]

Defined in: [src/utils/performance.ts:242](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L242)

Formats summaries using [formatSummary](../functions/formatSummary.md).

#### Returns

`string`[]

Array of formatted summary strings

***

### record()

> **record**(`measurement`): `void`

Defined in: [src/utils/performance.ts:193](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L193)

Records a measurement in the collector.

#### Parameters

##### measurement

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement to record

#### Returns

`void`

***

### recordMany()

> **recordMany**(`measurements`): `void`

Defined in: [src/utils/performance.ts:201](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L201)

Records multiple measurements in sequence.

#### Parameters

##### measurements

`Iterable`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Iterable of measurements to record

#### Returns

`void`

***

### summarize()

> **summarize**(): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Defined in: [src/utils/performance.ts:226](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L226)

Computes summary statistics for the recorded measurements.

#### Returns

`Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Map of label to summary statistics

***

### summarizeArray()

> **summarizeArray**(): [`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Defined in: [src/utils/performance.ts:234](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/performance.ts#L234)

Convenience helper returning all summaries as an array.

#### Returns

[`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Array of summary statistics
