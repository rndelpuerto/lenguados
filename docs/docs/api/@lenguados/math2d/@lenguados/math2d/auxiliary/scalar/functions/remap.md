# Function: remap()

> **remap**(`value`, `inMin`, `inMax`, `outMin`, `outMax`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:161](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L161)

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

## Example

```typescript
remap(5, 0, 10, 0, 100);    // 50
remap(75, 0, 100, -1, 1);   // 0.5
```

## Since

1.0.0
