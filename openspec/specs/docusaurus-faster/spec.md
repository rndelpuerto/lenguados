## ADDED Requirements

### Requirement: Docusaurus SWC acceleration enabled

The documentation site MUST use `@docusaurus/faster` to replace Babel with SWC for JavaScript transpilation and Terser with SWC for minification.

#### Scenario: Faster flag is configured

- **WHEN** `docs/docusaurus.config.ts` is inspected
- **THEN** the config SHALL include `future: { experimental_faster: true }`

#### Scenario: @docusaurus/faster is installed

- **WHEN** `npm ls @docusaurus/faster` is executed in the docs workspace
- **THEN** `@docusaurus/faster` SHALL be listed as a direct dependency with a version compatible with the installed Docusaurus core version

### Requirement: Documentation site builds successfully

The docs site MUST build without errors under the SWC-accelerated pipeline.

#### Scenario: Production build succeeds

- **WHEN** `npm run build` is executed in the docs workspace
- **THEN** the build SHALL complete without errors and produce the static site output

#### Scenario: Development server starts

- **WHEN** `npm run start` is executed in the docs workspace
- **THEN** the development server SHALL start and serve the documentation site without errors

### Requirement: TypeDoc API documentation compatibility

The TypeDoc-generated API documentation MUST render correctly under the SWC-accelerated Docusaurus build. The `markdown.format: 'detect'` configuration MUST continue to work.

#### Scenario: API docs render under SWC build

- **WHEN** the docs site is built with `@docusaurus/faster` enabled
- **THEN** the TypeDoc-generated pages under the API section SHALL render without MDX parsing errors

### Requirement: Existing documentation content preserved

All existing documentation pages, navigation, and theme customizations MUST work identically under the accelerated build.

#### Scenario: Site content matches pre-migration

- **WHEN** the docs site is built with `@docusaurus/faster` enabled
- **THEN** the sidebar navigation, navbar items, footer links, and custom CSS SHALL render identically to the pre-migration build
