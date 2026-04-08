# Interface: ReadonlySinCos

Defined in: [src/types/index.ts:541](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L541)

Read-only variant of [SinCos](SinCos.md) for cached angle lookup tables.

## Remarks

Follows the Readonly\*Like pattern established by all other value types
(ReadonlyVector2Like, ReadonlyRotation2Like, ReadonlyComplexLike, etc.).
Use when storing pre-computed sin/cos values that should not be mutated.

## Since

0.7.0

## Properties

### cos

> `readonly` **cos**: `number`

Defined in: [src/types/index.ts:545](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L545)

Cosine of the angle (read-only).

---

### sin

> `readonly` **sin**: `number`

Defined in: [src/types/index.ts:543](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L543)

Sine of the angle (read-only).
