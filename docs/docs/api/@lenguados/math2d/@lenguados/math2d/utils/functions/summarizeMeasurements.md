# Function: summarizeMeasurements()

> **summarizeMeasurements**\<`T`\>(`collector`): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Defined in: [src/utils/performance.ts:190](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/performance.ts#L190)

Computes summary statistics for every label within a measurement collector.

## Type Parameters

### T

`T`

## Parameters

### collector

`Map`\<`string`, [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Map produced via [recordMeasurement](recordMeasurement.md)

## Returns

`Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Map of label to summary statistics

## Example

```typescript
const summaries = summarizeMeasurements(new Map());
```

## Since

0.7.0
