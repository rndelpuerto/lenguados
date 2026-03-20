# Class: MeasurementCollector\<T\>

Defined in: [src/utils/performance.ts:281](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L281)

Convenience wrapper around [recordMeasurement](../functions/recordMeasurement.md) and [summarizeMeasurements](../functions/summarizeMeasurements.md).

## Example

```typescript
const collector = new MeasurementCollector<number>();
collector.record(measure('tick', () => 1));
```

## Since

0.7.0

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new MeasurementCollector**\<`T`\>(): `MeasurementCollector`\<`T`\>

#### Returns

`MeasurementCollector`\<`T`\>

## Accessor

### entries

#### Get Signature

> **get** **entries**(): `ReadonlyMap`\<`string`, readonly [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Defined in: [src/utils/performance.ts:328](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L328)

Returns a snapshot of the underlying measurements map.

##### Since

0.7.0

##### Returns

`ReadonlyMap`\<`string`, readonly [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Read-only view of recorded measurements

## Computed

### summarize()

> **summarize**(): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Defined in: [src/utils/performance.ts:340](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L340)

Computes summary statistics for the recorded measurements.

#### Returns

`Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Map of label to summary statistics

#### Since

0.7.0

---

### summarizeArray()

> **summarizeArray**(): [`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Defined in: [src/utils/performance.ts:352](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L352)

Convenience helper returning all summaries as an array.

#### Returns

[`MeasurementSummary`](../interfaces/MeasurementSummary.md)[]

Array of summary statistics

#### Since

0.7.0

## Conversion

### formatSummaries()

> **formatSummaries**(): `string`[]

Defined in: [src/utils/performance.ts:364](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L364)

Formats summaries using [formatSummary](../functions/formatSummary.md).

#### Returns

`string`[]

Array of formatted summary strings

#### Since

0.7.0

## Mutator

### clear()

> **clear**(): `void`

Defined in: [src/utils/performance.ts:316](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L316)

Clears all recorded measurements.

#### Returns

`void`

#### Since

0.7.0

---

### record()

> **record**(`measurement`): `void`

Defined in: [src/utils/performance.ts:292](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L292)

Records a measurement in the collector.

#### Parameters

##### measurement

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement to record

#### Returns

`void`

#### Since

0.7.0

---

### recordMany()

> **recordMany**(`measurements`): `void`

Defined in: [src/utils/performance.ts:304](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L304)

Records multiple measurements in sequence.

#### Parameters

##### measurements

`Iterable`\<[`Measurement`](../interfaces/Measurement.md)\<`T`\>\>

Iterable of measurements to record

#### Returns

`void`

#### Since

0.7.0
