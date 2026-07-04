# @lenguados/{{ cookiecutter.package_name }}

## Table of Contents

- [Usage](#usage)
  - [Install](#install)
  - [Scripts](#scripts)
  - [Module](#module)
- [Examples](#examples)
- [Full Specs](#full-specs)
- [Changelog](#changelog)

> {{ cookiecutter.package_description }}

## Usage

### Install

```sh
npm install @lenguados/{{ cookiecutter.package_name }}
```

### Scripts

Build, test, and lint through the monorepo root scripts. See the
[contributing guide](https://github.com/rndelpuerto/lenguados/blob/main/CONTRIBUTING.md)
for the full workflow.

### Module

Import the module to use it:

```js
import { greet } from '@lenguados/{{ cookiecutter.package_name }}';
```

## Examples

### Basic example

```ts
import { greet } from '@lenguados/{{ cookiecutter.package_name }}';

const message = greet('Ada');

console.log(message); // Expected output: "Hello, Ada!"
```

## Full Specs

| Property   | Description           | Type | Default     | Required |
| ---------- | --------------------- | ---- | ----------- | -------- |
| `property` | Property description. | type | `undefined` |          |

## Changelog

We keep changes to our codebase [here](./CHANGELOG.md)
