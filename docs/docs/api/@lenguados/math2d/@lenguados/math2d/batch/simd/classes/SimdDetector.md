# Class: SimdDetector

Capability detector for SIMD execution.

## Remarks

Detection is cached after the first invocation. Tests may override the
detection result via [SimdDetector.setForcedResult](#setforcedresult).

## Constructors

### Constructor

> **new SimdDetector**(): `SimdDetector`

#### Returns

`SimdDetector`

## Methods

### detect()

> `static` **detect**(): `boolean`

Performs detection (if necessary) and returns whether SIMD is supported.

#### Returns

`boolean`

True when SIMD is available on the current runtime.

---

### getState()

> `static` **getState**(): [`SimdSupportState`](../enumerations/SimdSupportState.md)

Returns the cached detection state. This triggers detection if it has not
yet been performed.

#### Returns

[`SimdSupportState`](../enumerations/SimdSupportState.md)

Current detection state

---

### reset()

> `static` **reset**(): `void`

Resets cached state and forced overrides.
Primarily intended for tests.

#### Returns

`void`

---

### setForcedResult()

> `static` **setForcedResult**(`result`): `void`

Forces a detection result (used for tests).
Passing `undefined` clears the forced result and resets cached state.

#### Parameters

##### result

Desired detection outcome.

`boolean` | `undefined`

#### Returns

`void`
