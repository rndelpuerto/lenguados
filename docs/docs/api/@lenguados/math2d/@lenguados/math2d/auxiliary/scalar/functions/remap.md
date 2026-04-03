# Function: remap()

> **remap**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:124](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L124)

Linear mapping from [inMin, inMax] to [outMin, outMax].

## Parameters

### value

`number`

Value to remap

### inMin

`number`

Input range minimum

### inMax

`number`

Input range maximum

### outMin

`number`

Output range minimum

### outMax

`number`

Output range maximum

## Returns

`number`

Remapped value

## Remarks

For large-magnitude operands, intermediate subtraction `(value - inMin)`
and multiplication may lose precision due to floating-point cancellation.

## Throws

If inMin === inMax (zero input range)

## Example

```typescript
remap(5, 0, 10, 0, 100); // 50
remap(75, 0, 100, -1, 1); // 0.5
```

## See

[remapSafe](remapSafe.md) - Returns outMin if ranges are degenerate

## Since

0.7.0
