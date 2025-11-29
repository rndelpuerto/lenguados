# Function: gradiansToRadians()

> **gradiansToRadians**(`gradians`): `number`

Converts gradians to radians (400 gradians = 2π radians).
Also known as gon or grade.

## Parameters

### gradians

`number`

Angle in gradians

## Returns

`number`

Angle in radians

## Remarks

Gradians are used in some surveying applications where
a right angle is exactly 100 gradians.

## Example

```typescript
gradiansToRadians(200); // Math.PI
gradiansToRadians(100); // Math.PI / 2
gradiansToRadians(400); // 2 * Math.PI
gradiansToRadians(50); // Math.PI / 4
```

## Since

1.0.0
