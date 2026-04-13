# @lenguados/common

[![npm version](https://img.shields.io/npm/v/@lenguados/common.svg)](https://www.npmjs.com/package/@lenguados/common)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> Shared utilities for the Lenguado physics-engine family.

This package provides cross-cutting utilities consumed by other `@lenguados/*` packages. It is not intended for direct end-user consumption.

## Installation

```bash
npm install @lenguados/common
```

## API

### `parseJSONData<TData>(data: string): TData | undefined`

Type-safe JSON parser that returns `undefined` on malformed input instead of throwing.

```typescript
import { parseJSONData } from '@lenguados/common';

const result = parseJSONData<{ x: number; y: number }>('{"x":1,"y":2}');
// result: { x: 1, y: 2 }

const invalid = parseJSONData('not json');
// invalid: undefined
```

## Documentation

- [Full Documentation](https://rndelpuerto.github.io/lenguados/docs/) -- docs site with architecture, standards, and API reference

## License

[Apache License 2.0](https://github.com/rndelpuerto/lenguados/blob/main/LICENSE)
