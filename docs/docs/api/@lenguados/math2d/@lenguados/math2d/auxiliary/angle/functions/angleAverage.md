# Function: angleAverage()

> **angleAverage**(`angles`): `number`

Defined in: [src/auxiliary/angle/operations.ts:335](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L335)

Calculates average of multiple angles.
Handles wrap-around correctly using vector addition.

## Parameters

### angles

`number`[]

Array of angles in radians

## Returns

`number`

Average angle

## Example

```typescript
angleAverage([0, Math.PI / 2]);                    // Math.PI / 4
angleAverage([0, Math.PI]);                        // Math.PI / 2
angleAverage([-Math.PI * 0.9, Math.PI * 0.9]);    // Math.PI (handles wrap)
angleAverage([]);                                  // 0 (empty input)
```

## Since

1.0.0
