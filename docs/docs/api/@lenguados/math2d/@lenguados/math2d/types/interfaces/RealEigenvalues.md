# Interface: RealEigenvalues

Defined in: [src/types/index.ts:432](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L432)

Eigenvalue result for a 2x2 matrix with two distinct or repeated real eigenvalues.

## Since

0.7.0

## Properties

### lambda1

> `readonly` **lambda1**: `number`

Defined in: [src/types/index.ts:436](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L436)

First eigenvalue (larger or equal).

---

### lambda2

> `readonly` **lambda2**: `number`

Defined in: [src/types/index.ts:438](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L438)

Second eigenvalue (smaller or equal).

---

### type

> `readonly` **type**: `"real"`

Defined in: [src/types/index.ts:434](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L434)

Discriminant tag for real eigenvalues.
