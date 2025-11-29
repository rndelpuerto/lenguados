# Function: summarizeMeasurements()

> **summarizeMeasurements**\<`T`\>(`collector`): `Map`\<`string`, [`MeasurementSummary`](../interfaces/MeasurementSummary.md)\>

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
