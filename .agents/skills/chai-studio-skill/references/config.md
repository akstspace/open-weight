# Chai Studio Project Config

Create `chai-studio.json` in the project root. This file tells the skill which Chai Studio application, preset, and rulesets to use by default.

## Minimal Schema

```json
{
  "$schema": "./chai-studio.schema.json",
  "applicationId": "d7f3c8cd-4288-4f21-9a42-386711866539",
  "applicationName": "Customer Portal",
  "presetId": "heritage-seed",
  "auditRuleSetIds": ["ruleset-default-craft"],
  "sync": {
    "source": "chai-studio",
    "lastSyncedAt": "2026-04-28T00:00:00.000Z"
  }
}
```

## Recommended Fields

- `applicationId`: required. Use `get-applications`; never invent this.
- `applicationName`: optional but helpful for humans.
- `presetId`: required for design sync. Usually present on the application record.
- `auditRuleSetIds`: required for audit upload. Choose from the application's `auditRuleSetIds` list returned by `get-applications`, then verify details via `get-rulesets` using `applicationId`.
- `sync.source`: usually `chai-studio`.
- `sync.lastSyncedAt`: update after meaningful doc sync.
- `metadata`: optional object for repo, branch, team, or environment notes.
- `design.yaml`: keep this file in the repo root and refresh it from `get_design_yaml(applicationId)` whenever Chai Studio context is used.

## Setup Workflow

1. Call `get-applications`.
2. Ask the user which application to configure for this project.
3. Use only the user-selected application.
4. Write `chai-studio.json`.
5. Call `get-presets` and `get-rulesets` (with `applicationId`) to verify `presetId` and `auditRuleSetIds`.
6. Call `get_design_yaml(applicationId)` and write/update `design.yaml`.
7. Delete local design mirror docs like `DESIGN.md` or `DESIGN-RULES.md`; keep only `design.yaml` synced from Chai Studio.

## Optional JSON Schema

If the project benefits from editor validation, create `chai-studio.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Chai Studio Project Config",
  "type": "object",
  "required": ["applicationId", "presetId", "auditRuleSetIds"],
  "properties": {
    "$schema": { "type": "string" },
    "applicationId": { "type": "string", "minLength": 1 },
    "applicationName": { "type": "string" },
    "presetId": { "type": "string", "minLength": 1 },
    "auditRuleSetIds": { "type": "array", "items": { "type": "string", "minLength": 1 }, "minItems": 1 },
    "sync": {
      "type": "object",
      "properties": {
        "source": { "type": "string" },
        "lastSyncedAt": { "type": "string" }
      },
      "additionalProperties": true
    },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```
