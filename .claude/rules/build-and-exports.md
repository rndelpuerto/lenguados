---
paths:
 - '**/package.json'
 - '**/rollup.config.*'
 - 'scripts/**'
 - '**/main.js'
 - '**/main.mjs'
 - '**/dev-main.mjs'
---

# Build System & Exports

## Package.json Exports Pattern

Every subpath export MUST follow this structure (order matters for resolution):

```json
{
 "types": "./lib/@types/module.d.ts",
 "development": {
  "require": "./lib/cjs/module.development.js",
  "import": "./lib/esm/module.development.js"
 },
 "default": {
  "require": "./lib/cjs/module.production.js",
  "import": "./lib/esm/module.production.js"
 }
}
```

**Rules:**

- `types` MUST precede `default` (TypeScript resolution requires this)
- `development` condition precedes `default` for dev/prod split
- All packages MUST declare `"sideEffects": false` for tree-shaking

## Three-File Entry Point Convention

Every package has three entry files at its root:

| File           | Purpose                                        | Module System |
| -------------- | ---------------------------------------------- | ------------- |
| `main.js`      | CJS with runtime `NODE_ENV` detection          | CommonJS      |
| `main.mjs`     | Production ESM (points to `lib/esm/module.js`) | ES Module     |
| `dev-main.mjs` | Development ESM (assertions active)            | ES Module     |

`main.js` pattern:

```javascript
if (process.env.NODE_ENV === 'production') {
 module.exports = require('./lib/cjs/index.production.js');
} else {
 module.exports = require('./lib/cjs/index.development.js');
}
```

## Build Output Structure

```
lib/
 cjs/           → CommonJS bundles (*.development.js, *.production.js)
 esm/           → ES Module bundles (*.development.js, *.production.js, module.js)
 @types/        → TypeScript declarations (*.d.ts)
```

- Production root ESM is `module.js` (not `index.production.js`)
- Each internal module also produces dev/prod variants

## Module Internals Registration

`module-internals.json` in each package root lists directories that get separate subpath exports:

```json
["validation", "deterministic", "utils"]
```

When adding a new module that consumers need to import directly:

1. Add directory name to `module-internals.json`
2. Add corresponding exports entry to `package.json`
3. Rollup automatically picks up the new entry point

## Build Scripts

All packages delegate to shared root scripts:

```json
{
 "build": "node ../../scripts/build.mjs",
 "clean": "node ../../scripts/clean.mjs",
 "watch": "node ../../scripts/watch.mjs"
}
```

Build mode is controlled by environment variable:

- `cross-env NODE_ENV=development` → dev bundles (assertions active)
- `cross-env NODE_ENV=production` → prod bundles (assertions stripped, minified)

## Common Package.json Fields

Every workspace package MUST include:

- `"engines": { "node": ">=24" }`
- `"publishConfig": { "access": "public" }`
- `"license": "Apache-2.0"`
- `"sideEffects": false`
- `"files"`: `["index.ts", "main.js", "main.mjs", "dev-main.mjs", "lib"]`
