# Function: formatSummary()

> **formatSummary**(`summary`): `string`

Defined in: [src/utils/performance.ts:256](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/performance.ts#L256)

Formats a measurement summary into a human-friendly string. Values are shown
with three decimal places by default.

## Parameters

### summary

[`MeasurementSummary`](../interfaces/MeasurementSummary.md)

Summary statistics to format

## Returns

`string`

Human-readable string

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
