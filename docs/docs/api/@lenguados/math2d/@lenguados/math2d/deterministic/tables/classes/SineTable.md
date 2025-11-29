# Class: SineTable

Sine lookup table for fast, deterministic sine calculations.

## Extends

- [`LookupTable`](LookupTable.md)

## Constructors

### Constructor

> **new SineTable**(`size`): `SineTable`

#### Parameters

##### size

`number` = `DEFAULT_TABLE_SIZE`

#### Returns

`SineTable`

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

Get sine value for angle.

#### Parameters

##### radians

`number`

Angle in radians

#### Returns

`number`

Sine of angle

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
