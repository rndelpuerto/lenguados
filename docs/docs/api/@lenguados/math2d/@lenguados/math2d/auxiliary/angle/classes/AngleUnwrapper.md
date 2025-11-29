# Class: AngleUnwrapper

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

Creates a new angle unwrapper.

#### Parameters

##### initialAngle?

`number`

Optional initial angle

#### Returns

`AngleUnwrapper`

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Returns the last unwrapped value.

##### Returns

`number`

The last unwrapped value

## Methods

### next()

> **next**(`theta`): `number`

Feeds a new wrapped angle and returns the continuous (unwrapped) value.
On first call, it initializes to the provided angle.

#### Parameters

##### theta

`number`

Wrapped angle in radians

#### Returns

`number`

Unwrapped angle in radians

---

### reset()

> **reset**(`theta?`): `void`

Resets the internal state. If `theta` is provided, sets it as the starting value.

#### Parameters

##### theta?

`number`

Optional new starting angle

#### Returns

`void`
