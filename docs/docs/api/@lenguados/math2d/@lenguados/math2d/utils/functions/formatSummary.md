# Function: formatSummary()

> **formatSummary**(`summary`): `string`

Defined in: [src/utils/performance.ts:256](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/performance.ts#L256)

Formats a measurement summary into a human-friendly string. Values are shown
with three decimal places by default.

## Parameters

### summary

[`MeasurementSummary`](../interfaces/MeasurementSummary.md)

Summary statistics to format.

## Returns

`string`

Human-readable string.

## Example

```typescript
const text = formatSummary({
 label: 'tick',
 count: 1,
 totalDuration: 2,
 minDuration: 2,
 maxDuration: 2,
 meanDuration: 2,
});
```

## Since

0.7.0
