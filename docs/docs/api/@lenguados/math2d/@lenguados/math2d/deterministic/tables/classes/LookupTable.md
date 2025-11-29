# Abstract Class: LookupTable

Base class for lookup tables.

## Extended by

- [`SineTable`](SineTable.md)
- [`CosineTable`](CosineTable.md)
- [`AtanTable`](AtanTable.md)

## Constructors

### Constructor

> **new LookupTable**(`size`): `LookupTable`

#### Parameters

##### size

`number` = `DEFAULT_TABLE_SIZE`

#### Returns

`LookupTable`

## Properties

### data

> `protected` `readonly` **data**: `Float64Array`

---

### size

> `protected` `readonly` **size**: `number`

## Methods

### initialize()

> `abstract` `protected` **initialize**(): `void`

Initialize the table with precalculated values.

#### Returns

`void`

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
