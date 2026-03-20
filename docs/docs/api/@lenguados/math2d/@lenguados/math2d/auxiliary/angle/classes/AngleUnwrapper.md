# Class: AngleUnwrapper

Defined in: [src/auxiliary/angle/unwrapping.ts:147](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L147)

Streaming unwrapper for angles in radians.
Maintains continuity across calls by accumulating shortest-arc deltas.

## Remarks

For very long sequences (>100K samples), accumulated floating-point error
in the unwrapped value may cause precision degradation. Consider periodic
re-anchoring via `reset()` for such use cases.

## Example

```typescript
const unwrapper = new AngleUnwrapper();

console.log(unwrapper.next(0)); // 0
console.log(unwrapper.next(Math.PI)); // Math.PI
console.log(unwrapper.next(0)); // 2 * Math.PI
console.log(unwrapper.value); // 2 * Math.PI

unwrapper.reset(0);
console.log(unwrapper.next(Math.PI)); // Math.PI
```

## Since

0.7.0

## Constructors

### Constructor

> **new AngleUnwrapper**(`initialAngle?`): `AngleUnwrapper`

Defined in: [src/auxiliary/angle/unwrapping.ts:155](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L155)

Creates a new angle unwrapper.

#### Parameters

##### initialAngle?

`number`

Optional initial angle

#### Returns

`AngleUnwrapper`

## Normalization

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:198](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L198)

Returns the last unwrapped value.

##### Since

0.7.0

##### Returns

`number`

The last unwrapped value

---

### next()

> **next**(`theta`): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:180](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L180)

Feeds a new wrapped angle and returns the continuous (unwrapped) value.
On first call, it initializes to the provided angle.

#### Parameters

##### theta

`number`

Wrapped angle in radians

#### Returns

`number`

Unwrapped angle in radians

#### Since

0.7.0

---

### reset()

> **reset**(`theta?`): `void`

Defined in: [src/auxiliary/angle/unwrapping.ts:209](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L209)

Resets the internal state. If `theta` is provided, sets it as the starting value.

#### Parameters

##### theta?

`number`

Optional new starting angle

#### Returns

`void`

#### Since

0.7.0

## Other

### initialized

#### Get Signature

> **get** **initialized**(): `boolean`

Defined in: [src/auxiliary/angle/unwrapping.ts:167](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/unwrapping.ts#L167)

Whether the unwrapper has received at least one angle.
Distinguishes uninitialized state from "initialized at 0".

##### Returns

`boolean`

True if the unwrapper has been initialized
