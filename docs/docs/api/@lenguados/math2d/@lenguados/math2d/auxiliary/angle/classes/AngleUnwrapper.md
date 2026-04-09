# Class: AngleUnwrapper

Defined in: [src/auxiliary/angle/unwrapping.ts:143](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L143)

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
console.log(unwrapper.next(3)); // 3
console.log(unwrapper.next(-3)); // 3.28... (continuous, not jumping to -3)
console.log(unwrapper.value); // 3.28...

unwrapper.reset(0);
console.log(unwrapper.next(1)); // 1
```

## Since

0.7.0

## Constructors

### Constructor

> **new AngleUnwrapper**(`initialAngle?`): `AngleUnwrapper`

Defined in: [src/auxiliary/angle/unwrapping.ts:151](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L151)

Creates a new angle unwrapper.

#### Parameters

##### initialAngle?

`number`

Optional initial angle

#### Returns

`AngleUnwrapper`

## Accessor

### initialized

#### Get Signature

> **get** **initialized**(): `boolean`

Defined in: [src/auxiliary/angle/unwrapping.ts:165](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L165)

Whether the unwrapper has received at least one angle.
Distinguishes uninitialized state from "initialized at 0".

##### Since

0.7.0

##### Returns

`boolean`

True if the unwrapper has been initialized

## Normalization

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:196](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L196)

Returns the last unwrapped value.

##### Since

0.7.0

##### Returns

`number`

The last unwrapped value

---

### next()

> **next**(`theta`): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:178](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L178)

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

Defined in: [src/auxiliary/angle/unwrapping.ts:207](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/unwrapping.ts#L207)

Resets the internal state. If `theta` is provided, sets it as the starting value.

#### Parameters

##### theta?

`number`

Optional new starting angle

#### Returns

`void`

#### Since

0.7.0
