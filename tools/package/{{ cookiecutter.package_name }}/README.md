# @lenguados/{{ cookiecutter.package_name }}

## Table of Contents

- [Description](#description)
- [Usage](#usage)
  - [Install](#install)
  - [Scripts](#styles)
  - [Module](#module)
- [Examples](#examples)
- [Full Specs](#full-specs)
- [Changelog](#changelog)

> {{ cookiecutter.package_description }}

## Usage

### Install

> Follow the [general installation guide](https://github.com/rndelpuerto/lenguados/blob/main/docs/guide/installation.md).

```sh
$ npm install --save @lenguados/{{ cookiecutter.package_name }}
```

### Scripts

> Follow the [general scripts usage guide](https://github.com/rndelpuerto/lenguados/blob/main/docs/guide/scripts-usage.md) for configuration and how-tos.

### Module

Import the module to use it:

```js
import { greet } from '@lenguados/{{ cookiecutter.package_name }}';
```

## Examples

### Basic example

```ts
import { greet } from '@lenguados/{{cookiecutter.package_name}}';

const message = greet('Ada');

console.log(message); // Expected output: "Hello, Ada!"
```

## Full Specs

| Property   | Description           | Type | Default     | Required |
| ---------- | --------------------- | ---- | ----------- | -------- |
| `property` | Property description. | type | `undefined` |          |

## Changelog

We keep changes to our codebase [here](./CHANGELOG.md)
