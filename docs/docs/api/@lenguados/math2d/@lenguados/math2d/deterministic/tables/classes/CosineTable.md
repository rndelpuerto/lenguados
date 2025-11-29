# Class: CosineTable

Cosine lookup table for fast, deterministic cosine calculations.

## Extends

- [`LookupTable`](LookupTable.md)

## Constructors

### Constructor

> **new CosineTable**(`size`): `CosineTable`

#### Parameters

##### size

`number` = `DEFAULT_TABLE_SIZE`

#### Returns

`CosineTable`

#### Inherited from

[`LookupTable`](LookupTable.md).[`constructor`](LookupTable.md#constructor)

## Properties

### data

> `protected` `readonly` **data**: `Float64Array`

#### Inherited from

[`LookupTable`](LookupTable.md).[`data`](LookupTable.md#data)

---

### size

> `protected` `readonly` **size**: `number`

#### Inherited from

[`LookupTable`](LookupTable.md).[`size`](LookupTable.md#size)

## Methods

### getValue()

> **getValue**(`radians`): `number`

Get cosine value for angle.

#### Parameters

##### radians

`number`

Angle in radians

#### Returns

`number`

Cosine of angle

---

### initialize()

> `protected` **initialize**(): `void`

Initialize the table with precalculated values.

#### Returns

`void`

#### Overrides

[`LookupTable`](LookupTable.md).[`initialize`](LookupTable.md#initialize)

---

### interpolate()

> `protected` **interpolate**(`index`): `number`

Get interpolated value from the table.

#### Parameters

##### index

`number`

Continuous index (may have fractional part)

#### Returns

`number`

Interpolated value

#### Inherited from

[`LookupTable`](LookupTable.md).[`interpolate`](LookupTable.md#interpolate)
