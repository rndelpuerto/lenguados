# Function: summarizeMeasurements()

> **summarizeMeasurements**\<`T`\>(`collector`): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Defined in: [src/utils/performance.ts:190](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/performance.ts#L190)

Computes summary statistics for every label within a measurement collector.

## Type Parameters

### T

`T`

## Parameters

### collector

`Map`\<`string`, [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Map produced via [recordMeasurement](recordMeasurement.md).

## Returns

`Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

Map of label to summary statistics.

## Example

```typescript
const summaries = summarizeMeasurements(new Map());
```

## Since

0.1.0
