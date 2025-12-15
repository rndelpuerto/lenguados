# Class: AngleUnwrapper

Defined in: [src/auxiliary/angle/unwrapping.ts:141](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/unwrapping.ts#L141)

Streaming unwrapper for angles in radians.
Maintains continuity across calls by accumulating shortest-arc deltas.

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

1.0.0

## Constructors

### Constructor

> **new AngleUnwrapper**(`initialAngle?`): `AngleUnwrapper`

Defined in: [src/auxiliary/angle/unwrapping.ts:149](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/unwrapping.ts#L149)

Creates a new angle unwrapper.

#### Parameters

##### initialAngle?

`number`

Optional initial angle.

#### Returns

`AngleUnwrapper`

## Unwrapping

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:183](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/unwrapping.ts#L183)

Returns the last unwrapped value.

##### Since

1.0.0

##### Returns

`number`

The last unwrapped value.

---

### next()

> **next**(`theta`): `number`

Defined in: [src/auxiliary/angle/unwrapping.ts:165](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/unwrapping.ts#L165)

Feeds a new wrapped angle and returns the continuous (unwrapped) value.
On first call, it initializes to the provided angle.

#### Parameters

##### theta

`number`

Wrapped angle in radians.

#### Returns

`number`

Unwrapped angle in radians.

#### Since

1.0.0

---

### reset()

> **reset**(`theta?`): `void`

Defined in: [src/auxiliary/angle/unwrapping.ts:194](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/unwrapping.ts#L194)

Resets the internal state. If `theta` is provided, sets it as the starting value.

#### Parameters

##### theta?

`number`

Optional new starting angle.

#### Returns

`void`

#### Since

1.0.0
