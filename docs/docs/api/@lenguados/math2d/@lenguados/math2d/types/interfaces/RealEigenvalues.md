# Interface: RealEigenvalues

Defined in: [src/types/index.ts:432](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L432)

Eigenvalue result for a 2x2 matrix with two distinct or repeated real eigenvalues.

## Since

0.8.0

## Properties

### lambda1

> `readonly` **lambda1**: `number`

Defined in: [src/types/index.ts:436](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L436)

First eigenvalue (larger or equal).

---

### lambda2

> `readonly` **lambda2**: `number`

Defined in: [src/types/index.ts:438](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L438)

Second eigenvalue (smaller or equal).

---

### type

> `readonly` **type**: `"real"`

Defined in: [src/types/index.ts:434](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L434)

Discriminant tag for real eigenvalues.
