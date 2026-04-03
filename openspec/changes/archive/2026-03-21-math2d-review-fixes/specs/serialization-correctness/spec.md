## MODIFIED Requirements

### Requirement: formatMatrix3 nested format produces valid array-of-arrays

The `formatMatrix3` function with `format: 'nested'` SHALL produce output wrapped in outer brackets, matching the pattern used by `formatMatrix2`. The output SHALL be a valid JavaScript array-of-arrays literal.

#### Scenario: formatMatrix3 nested format output

- **WHEN** calling `formatMatrix3(identity3, 'nested')`
- **THEN** the output SHALL be `[[1,0,0],[0,1,0],[0,0,1]]`
- **AND** the output SHALL start with `[[` and end with `]]`

#### Scenario: formatMatrix3 nested matches formatMatrix2 pattern

- **WHEN** comparing `formatMatrix2(m2, 'nested')` and `formatMatrix3(m3, 'nested')` output structure
- **THEN** both SHALL produce `[[row1],[row2],...]` format with outer brackets

#### Scenario: formatMatrix3 flat format unchanged

- **WHEN** calling `formatMatrix3(identity3, 'flat')`
- **THEN** the output SHALL remain `1,0,0,0,1,0,0,0,1` (no change)

#### Scenario: formatMatrix3 json format unchanged

- **WHEN** calling `formatMatrix3(identity3, 'json')`
- **THEN** the output SHALL remain a JSON object string (no change)
