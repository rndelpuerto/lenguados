# Class: AtanTable

Arctangent lookup table for atan2 approximation.

## Extends

- [`LookupTable`](LookupTable.md)

## Constructors

### Constructor

> **new AtanTable**(`size`): `AtanTable`

#### Parameters

##### size

`number` = `DEFAULT_TABLE_SIZE`

#### Returns

`AtanTable`

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

> **getValue**(`y`, `x`): `number`

Get arctangent value for ratio y/x.

#### Parameters

##### y

`number`

Y component

##### x

`number`

X component

#### Returns

`number`

Angle in radians

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
