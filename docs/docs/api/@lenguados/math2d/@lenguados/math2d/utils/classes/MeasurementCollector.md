# Class: MeasurementCollector\<T\>

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

Returns a snapshot of the underlying measurements map.

##### Returns

`ReadonlyMap`\<`string`, readonly [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Read-only view of recorded measurements

## Methods

### clear()

> **clear**(): `void`

Clears all recorded measurements.

#### Returns

`void`

---

### formatSummaries()

> **formatSummaries**(): `string`[]

Formats summaries using [formatSummary](../functions/formatSummary.md).

#### Returns

`string`[]

Array of formatted summary strings

---

### record()

> **record**(`measurement`): `void`

Records a measurement in the collector.

#### Parameters

##### measurement

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement to record

#### Returns

`void`

---

### recordMany()

> **recordMany**(`measurements`): `void`

Records multiple measurements in sequence.

#### Parameters

##### measurements

`Iterable`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Iterable of measurements to record

#### Returns

`void`

---

### summarize()

> **summarize**(): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Computes summary statistics for the recorded measurements.

#### Returns

`Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Map of label to summary statistics

---

### summarizeArray()

> **summarizeArray**(): [`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Convenience helper returning all summaries as an array.

#### Returns

[`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Array of summary statistics
