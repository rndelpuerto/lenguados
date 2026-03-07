# Function: recordMeasurement()

> **recordMeasurement**\<`T`\>(`collector`, `measurement`): `void`

Defined in: [src/utils/performance.ts:143](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/performance.ts#L143)

Accumulates measurements into a target collector.

## Type Parameters

### T

`T`

## Parameters

### collector

`Map`\<`string`, [`Measurement`](../interfaces/Measurement.md)\<`T`\>[]\>

Map to accumulate measurements into.

### measurement

[`Measurement`](../interfaces/Measurement.md)\<`T`\>

Measurement to record.

## Returns

`void`

## Example

```typescript
const collector = new Map<string, Measurement<number>[]>();
recordMeasurement(
 collector,
 measure('tick', () => 1),
);
```

## Since

0.7.0
